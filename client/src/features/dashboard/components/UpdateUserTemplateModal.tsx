import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, 
  Type, 
  Save, 
  Maximize2,
  Undo2,
  Redo2,
  Layout,
  Layers,
  Settings2,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCcw,
  RotateCw,
  Plus,
  Eye,
  Settings2 as SettingsIcon
} from 'lucide-react';
import api from '../../../services/api';
import { savedTemplateService } from '../../../services/savedTemplateService';
import { UserTemplate } from '../../../types/product';

// Module-level imports
import { DesignElement, ProductTemplate } from '../../../types/product';
import { LayerManager } from './mockup-editor/LayerManager';
import { CanvasArea } from './mockup-editor/CanvasArea';
import { ToolSidebar } from './mockup-editor/ToolSidebar';
import { PropertyPanel } from './mockup-editor/PropertyPanel';

interface UpdateUserTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTemplate: UserTemplate | null;
  onSuccess?: () => void;
}

export const UpdateUserTemplateModal: React.FC<UpdateUserTemplateModalProps> = ({
  isOpen,
  onClose,
  userTemplate,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'text' | 'layers' | 'settings'>('design');
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [elements, setElements] = useState<DesignElement[]>([]);
  // Cache for elements per view: { [viewId]: DesignElement[] }
  const [elementsCache, setElementsCache] = useState<Record<string, DesignElement[]>>({});
  const [currentTemplate, setCurrentTemplate] = useState<ProductTemplate | null>(null);
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadedGallery, setUploadedGallery] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeViewId, setActiveViewId] = useState<string | number>('front');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const canvasCaptureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalChange = useRef(false);

  const initializedId = useRef<number | null>(null);

  const saveToHistory = useCallback((newElements: DesignElement[]) => {
    if (isInternalChange.current) return;
    const newState = JSON.parse(JSON.stringify(newElements));
    
    setHistory(prev => {
      if (historyIndex >= 0) {
        const currentState = prev[historyIndex];
        if (JSON.stringify(currentState) === JSON.stringify(newState)) return prev;
      }
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => (prev + 1 > 49 ? 49 : prev + 1));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setElements(JSON.parse(JSON.stringify(prevState)));
      setHistoryIndex(prevIndex);
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setElements(JSON.parse(JSON.stringify(nextState)));
      setHistoryIndex(nextIndex);
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  }, [historyIndex, history]);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>, skipHistory = false) => {
    setElements(prev => {
       const newElements = prev.map(e => e.id === id ? { ...e, ...updates } : e);
       if (!skipHistory) saveToHistory(newElements);
       return newElements;
    });
  }, [saveToHistory]);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => {
      const newElements = prev.filter(e => e.id !== id);
      if (selectedId === id) setSelectedId(null);
      saveToHistory(newElements);
      return newElements;
    });
    setDeleteConfirmId(null);
  }, [selectedId, saveToHistory]);

  const addNewElement = useCallback((type: 'image' | 'text', data?: any) => {
    const newElement: DesignElement = {
      id: "el_" + Date.now(),
      type,
      viewId: activeViewId as any,
      x: 0,
      y: 0,
      scale: 0.5,
      rotate: 0,
      opacity: 100,
      isVisible: true,
      ...(type === 'image' ? { url: data.url } : { 
        text: 'New Text', 
        color: '#000000', 
        fontSize: 24, 
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center',
        maxWidth: 300,
        curve: 0
      }),
    };
    setElements(prev => {
      const newElements = [...prev, newElement];
      saveToHistory(newElements);
      return newElements;
    });
    setSelectedId(newElement.id);
    
    // Auto-open property panel on mobile when adding element
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const propPanel = document.getElementById('mobile-property-panel-update');
        if (propPanel) propPanel.classList.remove('translate-y-full');
      }, 100);
    }
  }, [activeViewId, saveToHistory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadFile = async () => {
        try {
          // 1. Get presigned upload parameters from BE
          const { data: presigned } = await api.get('/user-templates/presigned-upload');
          
          // 2. Upload directly to Cloudinary using FormData
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', presigned.api_key);
          formData.append('timestamp', presigned.timestamp.toString());
          formData.append('signature', presigned.signature);
          formData.append('folder', presigned.folder);
          
          const response = await fetch(presigned.upload_url, {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          
          if (result.secure_url) {
            const cloudinaryUrl = result.secure_url;
            setUploadedGallery(prev => [cloudinaryUrl, ...prev]);
            addNewElement('image', { url: cloudinaryUrl });
          } else {
            throw new Error('Upload failed');
          }
        } catch (err) {
          console.error("Presigned upload failed (update mode):", err);
          // Fallback to base64
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            addNewElement('image', { url: base64 });
          };
          reader.readAsDataURL(file);
        }
      };

      uploadFile();
    }
  };

  const moveLayer = (from: number, to: number) => {
    setElements(prev => {
      const newElements = [...prev];
      const [movedItem] = newElements.splice(from, 1);
      newElements.splice(to, 0, movedItem);
      saveToHistory(newElements);
      return newElements;
    });
  };

  const handleCanvasSelect = (id: string, e: React.MouseEvent) => {
    setSelectedId(id);
    
    // Auto-open property panel on mobile when selecting an element
    if (window.innerWidth < 1024) {
      const propPanel = document.getElementById('mobile-property-panel-update');
      if (propPanel) propPanel.classList.remove('translate-y-full');
    }

    const element = elements.find(el => el.id === id);
    if (!element) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - element.x, y: e.clientY - element.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId) return;
    
    // Check if over trash area
    const trashElement = document.getElementById('canvas-trash-bin-update');
    if (trashElement) {
      const rect = trashElement.getBoundingClientRect();
      const isOver = e.clientX >= rect.left && e.clientX <= rect.right && 
                     e.clientY >= rect.top && e.clientY <= rect.bottom;
      setIsOverTrash(isOver);
    }

    updateElement(selectedId, {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    }, true);
  };

  const handleMouseUp = () => {
    if (isDragging && selectedId) {
      if (isOverTrash) {
        deleteElement(selectedId);
        setIsOverTrash(false);
      } else {
        saveToHistory(elements);
      }
    }
    setIsDragging(false);
    setIsOverTrash(false);
  };

  const handleViewSwitch = (newViewId: string | number) => {
    // 1. Correctly update the elements cache with CURRENT elements before switching
    setElementsCache(prev => {
      const updatedCache = {
        ...prev,
        [activeViewId]: [...elements]
      };
      
      // 2. Set active elements to the new view's data from the NEWLY updated cache
      const nextElements = updatedCache[newViewId] || [];
      setElements(nextElements);
      
      return updatedCache;
    });
    
    // 3. Update active view ID
    setActiveViewId(newViewId);
    setSelectedId(null); // Clear selection for new view
    
    // 4. Update preview image
    const targetView = currentTemplate?.views?.find(v => v.id === newViewId);
    if (targetView) setLivePreviewUrl(targetView.image_url);
  };

  useEffect(() => {
    if (!isOpen || !userTemplate) {
      initializedId.current = null;
      setCurrentTemplate(null);
      return;
    }

    if (initializedId.current === userTemplate.id && currentTemplate) return;

    if (userTemplate.design_data) {
      try {
        const data = JSON.parse(userTemplate.design_data);
        
        // Support multi-view data structure
        if (data.viewsData) {
          setElementsCache(data.viewsData);
          
          let firstViewId: string | number = activeViewId;
          const pt = userTemplate.product_template;
          const views = pt?.views || [];
          if (views.length > 0) {
            const matches = views.find((v: any) => v.id === firstViewId);
            if (!matches) firstViewId = views[0].id;
          }
          
          setElements(data.viewsData[firstViewId] || []);
          setActiveViewId(firstViewId);
          
          setHistory([data.viewsData]);
          setHistoryIndex(0);
        } else {
          // Legacy single view
          const savedElements = data.elements || [];
          setElements(savedElements);
          setElementsCache({ front: savedElements });
          setActiveViewId('front');
          setHistory([savedElements]);
          setHistoryIndex(0);
        }
        
        // Extract all image URLs for gallery
        const allElements = data.viewsData ? 
          Object.values(data.viewsData).flat() as DesignElement[] : 
          (data.elements || []) as DesignElement[];
          
        const urls = allElements
          .filter(e => e.type === 'image' && e.url)
          .map(e => e.url as string);
        setUploadedGallery(prev => [...new Set([...prev, ...urls])]);

      } catch (e) {
        console.error("Failed to parse design data", e);
      }
    }

    const pt = userTemplate.product_template;
    if (pt) {
      const templateObj: ProductTemplate = {
        id: pt.id || userTemplate.product_template_id || 0,
        name: userTemplate.name,
        sku: pt.sku,
        image_url: pt.image_url,
        base_price: pt.base_price || 0,
        price: pt.base_price || 0,
        currency: pt.currency || 'USD',
        default_profit: pt.default_profit || 0,
        rating: pt.rating || 5,
        review_count: pt.review_count || 0,
        colors: typeof pt.colors === 'string' ? pt.colors.split(',').map(s => s.trim()) : pt.colors || [],
        sizes: typeof pt.sizes === 'string' ? pt.sizes.split(',').map(s => s.trim()) : pt.sizes || [],
        category: pt.category || "",
        views: pt.views || [],
        description: pt.description || "",
        provider: pt.provider || "",
        variants: pt.variants || 0,
        specs: pt.specs || [],
        features: pt.features || []
      };
      setCurrentTemplate(templateObj);
      
      // Select first view if available
      if (pt.views && pt.views.length > 0 && !activeViewId) {
        const firstView = pt.views[0];
        setActiveViewId(firstView.id);
        setLivePreviewUrl(firstView.image_url);
      } else {
        setLivePreviewUrl(userTemplate.preview_image_url || pt.image_url);
      }
    }

    initializedId.current = userTemplate.id;
  }, [isOpen, userTemplate]);

  useEffect(() => {
    if (isDragging) return;

    const timer = setTimeout(async () => {
      if (canvasCaptureRef.current && currentTemplate) {
        try {
          const captureEl = canvasCaptureRef.current.querySelector("[data-capture-container=\"true\"]") || canvasCaptureRef.current;
          const canvas = await html2canvas(captureEl as HTMLElement, {
            useCORS: true,
            backgroundColor: null,
            scale: 2,
            logging: false,
            allowTaint: true
          });
          setLivePreviewUrl(canvas.toDataURL('image/png', 0.8));
        } catch (err) {
          console.error("Live preview failed:", err);
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [elements, isDragging, activeViewId, currentTemplate]);

  const handleSave = async () => {
    if (!currentTemplate || !userTemplate) return;
    setIsSaving(true);
    try {
      // Correctly update the elements cache with CURRENT elements before saving
      const finalCache = {
        ...elementsCache,
        [activeViewId]: elements
      };

      // 1. Process all elements to ensure no base64 remains using Presigned URL
      for (const viewId in finalCache) {
        const viewElements = finalCache[viewId] as DesignElement[];
        for (let i = 0; i < viewElements.length; i++) {
          const el = viewElements[i];
          if (el.type === 'image' && el.url && el.url.startsWith('data:image')) {
            try {
              const { data: presigned } = await api.get('/user-templates/presigned-upload');
              const formData = new FormData();
              formData.append('file', el.url);
              formData.append('api_key', presigned.api_key);
              formData.append('timestamp', presigned.timestamp.toString());
              formData.append('signature', presigned.signature);
              formData.append('folder', presigned.folder);
              
              const response = await fetch(presigned.upload_url, { method: 'POST', body: formData });
              const result = await response.json();
              if (result.secure_url) {
                viewElements[i].url = result.secure_url;
              }
            } catch (uploadErr) {
              console.error("Failed to upload image element during update save:", uploadErr);
            }
          }
        }
      }

      // Sync state back
      setElementsCache(finalCache);
      setElements(finalCache[activeViewId] || []);

      setSelectedId(null);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let primaryPreviewUrl = userTemplate.preview_image_url;
      const viewSnapshots: Record<string, string> = {};

      const viewsToCapture = Object.keys(finalCache).filter(v => finalCache[v].length > 0);

      if (canvasCaptureRef.current) {
        const originalViewId = activeViewId;

        for (const viewId of viewsToCapture) {
          // Temporarily switch view for capture
          setActiveViewId(viewId);
          setElements(finalCache[viewId]);
          
          await new Promise(resolve => setTimeout(resolve, 200));

          const captureEl = canvasCaptureRef.current.querySelector("[data-capture-container=\"true\"]") || canvasCaptureRef.current;
          const canvas = await html2canvas(captureEl as HTMLElement, {
            useCORS: true,
            backgroundColor: null,
            scale: 2,
            logging: false,
            allowTaint: false,
          });
          
          const dataUrl = canvas.toDataURL('image/png', 0.8);
          
          try {
            const { data: presigned } = await api.get('/user-templates/presigned-upload');
            const formData = new FormData();
            formData.append('file', dataUrl);
            formData.append('api_key', presigned.api_key);
            formData.append('timestamp', presigned.timestamp.toString());
            formData.append('signature', presigned.signature);
            formData.append('folder', presigned.folder);
            
            const response = await fetch(presigned.upload_url, { method: 'POST', body: formData });
            const result = await response.json();
            
            if (result.secure_url) {
              viewSnapshots[viewId] = result.secure_url;
              if (viewId === 'front' || !primaryPreviewUrl) primaryPreviewUrl = result.secure_url;
            } else {
              viewSnapshots[viewId] = dataUrl;
            }
          } catch (e) {
            console.warn("View snapshot upload failed, falling back to base64", e);
            viewSnapshots[viewId] = dataUrl;
          }
        }

        // Restore UI state
        setActiveViewId(originalViewId);
        setElements(finalCache[originalViewId]);
      }

      const designData = JSON.stringify({ 
        elements: finalCache['front'] || [],
        viewsData: finalCache,
        viewSnapshots
      });

      await savedTemplateService.saveTemplate({
        id: userTemplate.id,
        product_template_id: userTemplate.product_template_id,
        name: currentTemplate.name,
        preview_image_url: primaryPreviewUrl, // Cloudinary URL
        design_data: designData
      });
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      alert(error.message || "Failed to update template.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedElement = useMemo(() => elements.find(e => e.id === selectedId), [elements, selectedId]);

  const displayTemplate = useMemo(() => {
    if (!currentTemplate) {
      if (userTemplate && userTemplate.product_template) {
        const pt = userTemplate.product_template;
        return {
          id: pt.id,
          name: userTemplate.name || 'Unnamed Design',
          description: pt.description || '',
          sku: pt.sku || 'NO-SKU',
          image_url: pt.image_url || '',
          views: pt.views || [],
          category: pt.category || '',
          provider: pt.provider || '',
          base_price: pt.base_price || 0,
          price: (pt.base_price || 0) + (pt.default_profit || 0),
          currency: pt.currency || 'USD',
          default_profit: pt.default_profit || 0,
          rating: pt.rating || 5,
          review_count: pt.review_count || 0,
          colors: typeof pt.colors === 'string' ? pt.colors.split(',').map(s => s.trim()) : pt.colors || [],
          sizes: typeof pt.sizes === 'string' ? pt.sizes.split(',').map(s => s.trim()) : pt.sizes || [],
          variants: pt.variants || 0,
          specs: pt.specs || [],
          features: pt.features || [],
        };
      }
      return null;
    }
    return currentTemplate;
  }, [currentTemplate, userTemplate]);

  if (!isOpen || !userTemplate) {
    return null;
  }

  if (!displayTemplate) {
    return (
      <div className="fixed inset-0 z-[70] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-900 font-black text-xl">Loading Design Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="bg-[#f8f9fb] w-full h-full md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-500">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-0.5 md:mb-1 w-fit bg-amber-100 text-amber-700 truncate">
                Updating Saved Design
              </span>
              <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                <input 
                  type="text"
                  value={displayTemplate.name || ''}
                  onChange={(e) => setCurrentTemplate({ ...displayTemplate, name: e.target.value })}
                  className="text-sm md:text-base font-extrabold text-gray-900 leading-none bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-32 sm:w-48 md:w-64 hover:bg-gray-50 rounded px-1 transition-colors truncate"
                  placeholder="Enter design name..."
                />
                <div className="hidden sm:block h-6 w-[1px] bg-gray-200 flex-shrink-0"></div>
                <div className="flex items-center gap-1 bg-indigo-50/50 px-2 py-0.5 md:py-1 rounded-lg border border-indigo-100/50 flex-shrink-0">
                  <span className="text-[10px] md:text-xs font-black text-indigo-600">$</span>
                  <input 
                    type="number"
                    value={displayTemplate.price}
                    onChange={(e) => setCurrentTemplate({ ...displayTemplate, price: parseFloat(e.target.value || '0') })}
                    className="w-10 md:w-16 bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-black text-indigo-700 text-xs md:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            <div className="hidden sm:flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button 
                onClick={undo} 
                disabled={historyIndex <= 0} 
                className={`p-1.5 md:p-2 rounded-lg transition-all ${historyIndex > 0 ? 'text-indigo-600 hover:bg-white hover:shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={16} />
              </button>
              <button 
                onClick={redo} 
                disabled={historyIndex >= history.length - 1} 
                className={`p-1.5 md:p-2 rounded-lg transition-all ${historyIndex < history.length - 1 ? 'text-indigo-600 hover:bg-white hover:shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={16} />
              </button>
            </div>
            <div className="hidden sm:block h-6 w-[1.5px] bg-gray-100 mx-0.5 md:mx-1"></div>
            <button 
              onClick={onClose} 
              className="p-2 md:p-2.5 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl text-gray-400 transition-all border border-gray-100"
              title="Close editor"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Vertical Toolbar Strip - Desktop only */}
          <div className="w-16 md:w-20 bg-white border-r border-gray-100 hidden md:flex flex-col items-center py-4 md:py-6 gap-3 md:gap-4 z-40">
            {[
              { id: "design", icon: Layout, label: "Assets" },
              { id: "text", icon: Type, label: "Text" },
              { id: "layers", icon: Layers, label: "Layers" },
              { id: "settings", icon: Settings2, label: "Settings" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsSidebarCollapsed(false);
                }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group ${
                  activeTab === tab.id && !isSidebarCollapsed
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <tab.icon size={18} />
                <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-tighter ${activeTab === tab.id && !isSidebarCollapsed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Asset/Content Panel */}
          <div 
            className={`
              absolute md:relative inset-y-0 left-0 md:left-0 bg-white md:bg-[#fbfcfd] border-r border-gray-100 flex flex-col h-full z-50 transition-all duration-300 ease-in-out
              ${showMobilePanel ? 'translate-x-0 w-[calc(100%-4rem)]' : '-translate-x-full md:translate-x-0'}
              ${isSidebarCollapsed ? 'md:w-0 md:overflow-hidden md:opacity-0 md:border-none' : 'md:w-80'}
              text-left
            `}
          >
             {/* Mobile Header for Panel */}
             <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">{activeTab}</span>
              <button 
                onClick={() => setShowMobilePanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className={`px-6 py-4 md:py-6 border-b border-gray-50 flex items-center justify-between min-w-[320px]`}>
              <h3 className="text-[11px] md:text-sm font-black text-gray-900 uppercase tracking-tight">
                {activeTab === "design" ? "Image Assets" : activeTab === "text" ? "Text Engine" : activeTab === "layers" ? "Layer Management" : "Global Settings"}
              </h3>
              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden md:block p-1 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Collapse Sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto min-w-[320px] custom-scrollbar">
              {activeTab === "layers" ? (
                <div className="p-4 md:p-6 overflow-visible">
                  <LayerManager 
                    elements={elements} 
                    selectedId={selectedId}
                    deleteConfirmId={deleteConfirmId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      if (window.innerWidth < 768) setShowMobilePanel(false);
                    }}
                    onToggleVisibility={(id) => updateElement(id, { isVisible: !elements.find(e => e.id === id)?.isVisible })}
                    onDelete={setDeleteConfirmId}
                    onReorder={moveLayer}
                    onCancelDelete={() => setDeleteConfirmId(null)}
                    onConfirmDelete={deleteElement}
                  />
                </div>
              ) : (
                <div className="overflow-y-auto h-full">
                  <ToolSidebar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    elements={elements}
                    selectedId={selectedId}
                    uploadedGallery={uploadedGallery}
                    onFileUpload={handleFileUpload}
                    onAddElement={(type, data) => {
                      addNewElement(type, data);
                      if (window.innerWidth < 768) setShowMobilePanel(false);
                    }}
                    onUpdateElement={updateElement}
                    onSaveHistory={() => saveToHistory(elements)}
                    fileInputRef={fileInputRef}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 relative flex flex-col bg-[#f0f2f5] overflow-hidden text-center">
            {/* Left Sidebar Collapse Toggle Switch - For Desktop */}
            {isSidebarCollapsed && (
              <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden md:flex absolute top-6 left-6 z-[60] p-2.5 bg-white shadow-xl rounded-xl text-indigo-600 hover:scale-110 active:scale-95 transition-all border border-indigo-50 text-left"
              >
                <PanelLeftOpen size={20} />
              </button>
            )}

            {/* Right Sidebar Collapse Toggle Switch - For Desktop */}
            {isRightSidebarCollapsed && selectedId && (
              <button 
                onClick={() => setIsRightSidebarCollapsed(false)}
                className="hidden lg:flex absolute top-6 right-6 z-[60] p-2.5 bg-white shadow-xl rounded-xl text-indigo-600 hover:scale-110 active:scale-95 transition-all border border-indigo-50 text-left"
              >
                <PanelRightOpen size={20} />
              </button>
            )}

            {/* Mobile Property Panel Toggle */}
            {selectedId && (
              <button 
                onClick={() => {
                  const propPanel = document.getElementById('mobile-property-panel-update');
                  if (propPanel) propPanel.classList.remove('translate-y-full');
                }}
                className="lg:hidden absolute top-4 right-4 z-[45] p-3 bg-white shadow-xl rounded-2xl text-indigo-600 border border-indigo-50 animate-bounce"
              >
                <Settings2 size={20} />
              </button>
            )}

            <CanvasArea 
              template={displayTemplate} 
              elements={elements} 
              selectedId={selectedId} 
              activeViewId={activeViewId}
              onSelect={handleCanvasSelect}
              onViewChange={handleViewSwitch}
              captureRef={canvasCaptureRef}
            />

            {/* Top View Selector Bar - Card Style with Background */}
            {displayTemplate.views && displayTemplate.views.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-2">
                <div className="flex items-center justify-center gap-3">
                  {displayTemplate.views.map((view: any) => {
                    const isActive = activeViewId === view.id;
                    return (
                      <button
                        key={view.id}
                        onClick={() => handleViewSwitch(view.id)}
                        className={`
                          group relative flex flex-col items-center transition-all duration-500 ease-out
                          ${isActive ? 'w-32 md:w-36' : 'w-14 md:w-16 hover:w-28 md:hover:w-32'}
                        `}
                      >
                        <div className={`
                          relative h-14 md:h-16 w-full rounded-2xl overflow-hidden border-2 transition-all duration-500 bg-white
                          ${isActive 
                            ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105' 
                            : 'border-transparent hover:border-white/50 shadow-md'}
                        `}>
                          <img 
                            src={view.image_url} 
                            alt={view.view_name || view.name} 
                            className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`} 
                          />
                          
                          {/* Checkmark Icon for Active State */}
                          {isActive && (
                            <div className="absolute top-1 right-1 bg-indigo-500 text-white p-0.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                              <Check size={12} strokeWidth={4} />
                            </div>
                          )}

                          {/* Label overlay for the card */}
                          <div className={`
                            absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-2 transition-opacity duration-300
                            ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                          `}>
                            <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] truncate px-2 text-center drop-shadow-md">
                              {view.view_name || view.name || view.id}
                            </span>
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1] animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Trash Bin - Only visible while dragging */}
            {isDragging && (
              <div 
                id="canvas-trash-bin-update"
                className={`absolute bottom-32 right-4 md:right-8 p-5 md:p-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-2xl z-50
                  ${isOverTrash 
                    ? 'bg-red-500 text-white scale-125 ring-4 ring-red-200' 
                    : 'bg-white text-gray-400 scale-100'
                  }`}
              >
                <Trash2 className={`${isOverTrash ? 'w-6 h-6 md:w-8 md:h-8 animate-bounce' : 'w-5 h-5 md:w-6 md:h-6'}`} />
                {isOverTrash && (
                  <span className="absolute -top-12 bg-red-600 text-white px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                    Drop to delete
                  </span>
                )}
              </div>
            )}

            {/* Quick Actions Footer & Mobile Sidebar Navigation */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-3 md:px-4 z-30 space-y-3">
              {/* Mobile Toolbar */}
              <div className="md:hidden flex items-center justify-around bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-2 shadow-2xl">
                {[
                  { id: 'design', icon: Layout, label: 'Assets' },
                  { id: 'text', icon: Type, label: 'Text' },
                  { id: 'layers', icon: Layers, label: 'Layers' },
                  { id: 'settings', icon: Settings2, label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setShowMobilePanel(true);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all ${
                      activeTab === tab.id && showMobilePanel
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-gray-400'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="text-[7px] font-black uppercase tracking-tighter">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                  <button 
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-1 relative group overflow-hidden transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 shadow-sm"
                  >
                    <img 
                      src={livePreviewUrl || displayTemplate.image_url} 
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                      alt="mini" 
                    />
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                      <Maximize2 size={16} className="text-indigo-600 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" />
                    </div>
                  </button>
                  <div className="text-left min-w-0">
                    <p className="font-extrabold text-gray-900 text-[10px] md:text-xs leading-tight truncate">{displayTemplate.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                      <span className="text-[9px] md:text-[10px] font-black text-indigo-600 bg-indigo-100/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-widest leading-none">
                        ${displayTemplate.price}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="bg-indigo-600 text-white px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {isSaving ? "Saving..." : <><Save size={16} /> <span className="hidden xs:inline">UPDATE DESIGN</span><span className="xs:hidden">UPDATE</span></>}
                </button>
              </div>
            </div>

            {/* Mobile Property Panel Drawer */}
            <div 
              id="mobile-property-panel-update"
              className="lg:hidden absolute inset-x-0 bottom-0 z-[1000] bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-gray-100 translate-y-full transition-transform duration-500 max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-gray-50 z-10 text-left">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2"></div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Element Properties</h4>
                <button 
                  onClick={() => document.getElementById('mobile-property-panel-update')?.classList.add('translate-y-full')}
                  className="p-2 bg-gray-50 rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 text-left">
                <PropertyPanel 
                  selectedElement={selectedElement || null}
                  onUpdateElement={updateElement}
                  onDelete={setDeleteConfirmId}
                  onSaveHistory={() => saveToHistory(elements)}
                />
              </div>
            </div>
          </div>

          {/* Configuration/Property Panel (Right) - Desktop only */}
          <div 
            className={`
              bg-white border-l border-gray-100 flex flex-col h-full z-20 transition-all duration-300 ease-in-out hidden lg:block
              ${isRightSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 border-none' : 'w-80'}
            `}
          >
            <div className="px-6 py-4 md:py-6 border-b border-gray-50 flex items-center justify-between min-w-[320px]">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Properties</h3>
              <button 
                onClick={() => setIsRightSidebarCollapsed(true)}
                className="p-1 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Collapse Panel"
              >
                <PanelRightClose size={18} />
              </button>
            </div>
            <div className="flex-1 min-w-[320px] overflow-y-auto custom-scrollbar">
              <PropertyPanel 
                selectedElement={selectedElement || null}
                onUpdateElement={updateElement}
                onDelete={setDeleteConfirmId}
                onSaveHistory={() => saveToHistory(elements)}
              />
            </div>
          </div>
        </div>
      </div>

      {isPreviewModalOpen && displayTemplate && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300 bg-gray-200 backdrop-blur-xl"
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-6 right-6 p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all z-10"
            >
              <X size={24} />
            </button>
            <div className="w-full aspect-[4/5] max-h-[80vh] flex items-center justify-center bg-gray-50">
              <img 
                src={livePreviewUrl || displayTemplate.image_url} 
                className="w-full h-full object-cover" 
                alt="Full Preview" 
              />
            </div>
            <div className="w-full p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-left">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{displayTemplate.name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{displayTemplate.sku}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sale Price</span>
                <span className="text-2xl font-black text-indigo-600">${displayTemplate.price}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUserTemplateModal;
