import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, 
  Type, 
  Upload, 
  Move, 
  RotateCw, 
  Settings2, 
  Save, 
  Eye,
  Plus,
  Trash2,
  Layout,
  Undo2,
  Redo2,
  RefreshCcw,
  Maximize2,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import api from '../../../services/api';
import { savedTemplateService } from '../../../services/savedTemplateService';

// Module-level imports
import { DesignElement, ProductTemplate } from '../../../types/product';
import { LayerManager } from './mockup-editor/LayerManager';
import { CanvasArea } from './mockup-editor/CanvasArea';
import { ToolSidebar } from './mockup-editor/ToolSidebar';
import { PropertyPanel } from './mockup-editor/PropertyPanel';

interface ProductMockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProductTemplate | null;
  onChangeProduct?: () => void;
  initialDesign?: {
    id?: number;
    name?: string;
    price?: number;
    design_data?: string;
    preview_image_url?: string;
  };
  onUpdateTemplateInfo?: (updates: { name?: string; price?: number }) => void;
}

export const ProductMockupModal: React.FC<ProductMockupModalProps> = ({
  isOpen,
  onClose,
  template,
  onChangeProduct,
  initialDesign,
  onUpdateTemplateInfo
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

  const isEditing = !!initialDesign?.id;
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const canvasCaptureRef = useRef<HTMLDivElement>(null);
  const selectedElement = elements.find(e => e.id === selectedId);

  const [isDragging, setIsDragging] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Undo/Redo State
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalChange = useRef(false);

  // Use a ref to track if we've already initialized for this specific design
  const initializedDesignId = useRef<number | string | null>(null);

  // Sync initial design data
  useEffect(() => {
    if (!isOpen) {
      initializedDesignId.current = null;
      return;
    }

    const designId = initialDesign?.id || 'new';
    if (initializedDesignId.current === designId) return;

    if (template) {
      // Initialize mode
      if (initialDesign && initialDesign.design_data) {
        try {
          const data = JSON.parse(initialDesign.design_data);
          
          // New logic: Check for multi-view data structure
          if (data.viewsData) {
            setElementsCache(data.viewsData);
            
            // Priority: previously selected view or first view in cache or 'front'
            let firstViewId: string | number = activeViewId;
            const views = template.views || [];
            if (views.length > 0) {
              const matches = views.find((v: any) => v.id === firstViewId);
              if (!matches) firstViewId = views[0].id;
            }
            
            setElements(data.viewsData[firstViewId] || []);
            setActiveViewId(firstViewId);
          } else if (data.elements) {
            // Fallback for old single-view designs
            setElements(data.elements);
            setElementsCache({ front: data.elements });
          }

          if (data.elements?.[0] || data.viewsData?.front?.[0]) {
            const firstEl = data.elements?.[0] || data.viewsData?.front?.[0];
            setSelectedId(firstEl.id);
          }
          
          setHistory([data.viewsData || { front: data.elements || [] }]);
          setHistoryIndex(0);
        } catch (e) {
          console.error("Failed to parse design data", e);
        }

        setCurrentTemplate({
          ...template,
          name: initialDesign.name || template.name,
          price: initialDesign.price || template.price
        });
        // If it's a saved design, the initial preview should be its saved image
        setLivePreviewUrl(initialDesign.preview_image_url || template.image_url);
      } else {
        // Initialize creating mode
        setElements([]);
        setSelectedId(null);
        setHistory([[]]);
        setHistoryIndex(0);
        setCurrentTemplate({ ...template });
        setLivePreviewUrl(template.image_url);
        
        // Select first view if available
        const views = template.views || [];
        if (views.length > 0) {
          setActiveViewId(views[0].id);
          setLivePreviewUrl(views[0].image_url);
        }
      }
    }

    initializedDesignId.current = designId;
  }, [isOpen, initialDesign, template]);

  const saveToHistory = (newElements: DesignElement[]) => {
    if (isInternalChange.current) return;
    const newState = JSON.parse(JSON.stringify(newElements));
    if (historyIndex >= 0) {
      const currentState = history[historyIndex];
      if (JSON.stringify(currentState) === JSON.stringify(newState)) return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setElements(JSON.parse(JSON.stringify(prevState)));
      setHistoryIndex(prevIndex);
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setElements(JSON.parse(JSON.stringify(nextState)));
      setHistoryIndex(nextIndex);
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, historyIndex, history.length]);

  // Debounced live preview update
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (canvasCaptureRef.current && currentTemplate) {
        try {
          const captureEl = canvasCaptureRef.current.querySelector('[data-capture-container="true"]') as HTMLElement;
          if (!captureEl) return;

          const img = captureEl.querySelector('img') as HTMLImageElement;
          const naturalWidth = img?.naturalWidth || captureEl.offsetWidth;

          const canvas = await html2canvas(captureEl, {
            useCORS: true,
            backgroundColor: null,
            logging: false,
            allowTaint: true,
            width: captureEl.offsetWidth,
            height: captureEl.offsetHeight,
            scale: 0.5, // Much faster for live preview thumbnail
            onclone: (clonedDoc) => {
              const el = clonedDoc.querySelector('[data-capture-container="true"]') as HTMLElement;
              if (el) {
                el.style.boxShadow = 'none';
                el.style.borderRadius = '0';
                el.style.border = 'none';
                el.style.backgroundColor = 'transparent';
                const designArea = el.querySelector('.border-dashed');
                if (designArea) (designArea as HTMLElement).style.border = 'none';
              }
            }
          });
          
          const highResImageData = canvas.toDataURL('image/jpeg', 0.5); 
          setLivePreviewUrl(highResImageData);
        } catch (err) {
          console.error("Live preview failed:", err);
        }
      }
    }, 300); 
    return () => clearTimeout(timer);
  }, [elements, activeViewId]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNewElement = (type: 'image' | 'text', data?: any) => {
    const newElement: DesignElement = {
      id: `el_${Date.now()}`,
      type,
      viewId: activeViewId as any,
      x: 0,
      y: 0,
      scale: 0.5,
      rotate: 0,
      opacity: 100,
      isVisible: true,
      width: 200,
      height: 200,
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
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedId(newElement.id);
    
    // Auto-open property panel on mobile when adding element
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const propPanel = document.getElementById('mobile-property-panel');
        if (propPanel) propPanel.classList.remove('translate-y-full');
      }, 100);
    }

    saveToHistory(newElements);
    if (type === 'image') {
      setUploadedGallery(prev => [...new Set([...prev, data.url])]);
    }
  };

  const updateElement = (id: string, updates: Partial<DesignElement>, skipHistory = false) => {
    const newElements = elements.map(e => e.id === id ? { ...e, ...updates } : e);
    setElements(newElements);
    if (!skipHistory) {
      saveToHistory(newElements);
    }
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(e => e.id !== id);
    setElements(newElements);
    if (selectedId === id) setSelectedId(null);
    saveToHistory(newElements);
    setDeleteConfirmId(null);
  };

  const moveLayer = (fromIndex: number, toIndex: number) => {
    const newElements = [...elements];
    const [movedItem] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, movedItem);
    setElements(newElements);
    saveToHistory(newElements);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview immediately for UX
      const localUrl = URL.createObjectURL(file);
      
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
          console.error("Presigned upload failed:", err);
          // Fallback to base64 only if presigned fails
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            addNewElement('image', { url: base64 });
          };
          reader.readAsDataURL(file);
        } finally {
          URL.revokeObjectURL(localUrl);
        }
      };

      uploadFile();
    }
  };

  const handleCanvasSelect = (id: string, e: React.MouseEvent) => {
    setSelectedId(id);
    
    // Auto-open property panel on mobile when selecting an element
    if (window.innerWidth < 1024) {
      const propPanel = document.getElementById('mobile-property-panel');
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
    const trashElement = document.getElementById('canvas-trash-bin');
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
    // 1. Lưu các layer hiện tại vào cache của view cũ
    const updatedCache = {
      ...elementsCache,
      [activeViewId]: [...elements]
    };
    
    // 2. Lấy các layer từ cache của view mới
    const nextElements = updatedCache[newViewId] || [];
    
    // 3. Cập nhật state đồng bộ
    setElementsCache(updatedCache);
    setElements(nextElements);
    setActiveViewId(newViewId);
    setSelectedId(null); 
    
    // 4. Cập nhật ảnh preview chính ngay lập tức
    const targetView = currentTemplate?.views?.find(v => v.id === newViewId);
    if (targetView) {
      setLivePreviewUrl(targetView.image_url);
    }
  };

  const handleSave = async () => {
    if (!currentTemplate) return;
    setIsSaving(true);
    try {
      // 1. Process all elements to ensure no base64 remains
      const processedViewsData = JSON.parse(JSON.stringify({ ...elementsCache, [activeViewId]: elements }));
      
      for (const viewId in processedViewsData) {
        const viewElements = processedViewsData[viewId] as DesignElement[];
        for (let i = 0; i < viewElements.length; i++) {
          const el = viewElements[i];
          if (el.type === 'image' && el.url && el.url.startsWith('data:image')) {
            try {
              // 1. Get presigned upload parameters from BE
              const { data: presigned } = await api.get('/user-templates/presigned-upload');
              
              // 2. Upload directly to Cloudinary using FormData
              const formData = new FormData();
              formData.append('file', el.url);
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
                viewElements[i].url = result.secure_url;
              }
            } catch (uploadErr) {
              console.error("Failed to upload image element during save:", uploadErr);
            }
          }
        }
      }

      // Update local state to reflect uploaded URLs (optional but good for consistency)
      setElementsCache(processedViewsData);
      setElements(processedViewsData[activeViewId] || []);

      // 2. Clear selection for a clean screenshot
      setSelectedId(null);
      await new Promise(resolve => setTimeout(resolve, 100));

      let primaryPreviewUrl = currentTemplate.image_url;
      const viewSnapshots: Record<string, string> = {};

      // Logic: Iterate over only views that have ACTUAL design elements
      const viewsToCapture = Object.keys(processedViewsData).filter(v => processedViewsData[v].length > 0);
      
      // If we're on multiple views, we capture EACH one for the production file
      if (canvasCaptureRef.current) {
        // Save original view ID to restore later
        const originalViewId = activeViewId;

        for (const viewId of viewsToCapture) {
          // Temporarily switch view for capture
          setActiveViewId(viewId);
          setElements(processedViewsData[viewId]);
          
          await new Promise(resolve => setTimeout(resolve, 200)); // UI flush

          const captureEl = (canvasCaptureRef.current.querySelector('[data-capture-container="true"]') || canvasCaptureRef.current) as HTMLElement;
          const img = captureEl.querySelector('img') as HTMLImageElement;
          const naturalWidth = img?.naturalWidth || captureEl.offsetWidth;

          const canvas = await html2canvas(captureEl, {
            useCORS: true,
            backgroundColor: null,
            scale: naturalWidth / captureEl.offsetWidth, 
            logging: false,
            allowTaint: false,
            onclone: (clonedDoc) => {
              const el = clonedDoc.querySelector('[data-capture-container="true"]') as HTMLElement;
              if (el) {
                el.style.boxShadow = 'none';
                el.style.borderRadius = '0';
                el.style.border = 'none';
                el.style.backgroundColor = 'transparent';
                const designArea = el.querySelector('.border-dashed');
                if (designArea) (designArea as HTMLElement).style.border = 'none';
              }
            }
          });
          
          const dataUrl = canvas.toDataURL('image/png', 0.8);
          
          // Upload the snapshot to Cloudinary using Presigned URL
          try {
            const { data: presigned } = await api.get('/user-templates/presigned-upload');
            const formData = new FormData();
            formData.append('file', dataUrl);
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
              viewSnapshots[viewId] = result.secure_url;
              if (viewId === 'front' || !primaryPreviewUrl) primaryPreviewUrl = result.secure_url;
            } else {
              viewSnapshots[viewId] = dataUrl; // fallback
            }
          } catch (e) {
            console.warn("View snapshot upload failed, falling back to base64", e);
            viewSnapshots[viewId] = dataUrl;
          }
        }

        // Restore UI state
        setActiveViewId(originalViewId);
        setElements(processedViewsData[originalViewId]);
      }

      const designData = JSON.stringify({ 
        elements: processedViewsData['front'] || [], // backward compat
        viewsData: processedViewsData,
        viewSnapshots // Store rendered versions per view
      });

      await savedTemplateService.saveTemplate({
        id: initialDesign?.id,
        product_template_id: currentTemplate.id,
        name: currentTemplate.name || initialDesign?.name || `My Design`,
        preview_image_url: primaryPreviewUrl, // This is now a Cloudinary URL
        design_data: designData
      });
      alert(initialDesign?.id ? "Template updated successfully!" : "Template saved successfully!");
      onClose();
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !currentTemplate) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-4 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-[#f8f9fb] w-full h-full md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-500">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-[60]">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <div className="flex flex-col min-w-0">
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-0.5 md:mb-1 w-fit truncate ${
                isEditing ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {isEditing ? 'Editing Saved Design' : 'Creating New Design'}
              </span>
              <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden">
                {onChangeProduct && !isEditing && (
                  <button onClick={onChangeProduct} className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-[10px] md:text-xs font-bold transition-all border border-gray-100 mr-1">
                    <RefreshCcw size={12} className="text-indigo-600" /> <span className="hidden xs:inline">Change</span>
                  </button>
                )}
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                  <div className="text-left min-w-0">
                    <input 
                      type="text"
                      value={currentTemplate.name}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                      className="text-sm md:text-base font-extrabold text-gray-900 leading-none bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-24 sm:w-40 md:w-64 hover:bg-gray-50 rounded px-1 transition-colors truncate"
                      placeholder="Enter design name..."
                    />
                  </div>
                  <div className="hidden xs:block h-6 w-[1px] bg-gray-200 flex-shrink-0"></div>
                  <div className="flex items-center gap-1 bg-indigo-50/50 px-2 py-0.5 md:py-1 rounded-lg border border-indigo-100/50 flex-shrink-0">
                    <span className="text-[10px] md:text-xs font-black text-indigo-600">$</span>
                    <input 
                      type="number"
                      value={currentTemplate.price}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, price: parseFloat(e.target.value) })}
                      className="w-10 md:w-16 bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-black text-indigo-700 text-xs md:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 ml-2">
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
              { id: 'design', icon: Layout, label: 'Assets' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'layers', icon: Layers, label: 'Layers' },
              { id: 'settings', icon: Settings2, label: 'Settings' }
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
              ${showMobilePanel ? 'translate-x-0 w-[calc(100%-5rem)]' : '-translate-x-full md:translate-x-0'}
              ${isSidebarCollapsed ? 'md:w-0 md:overflow-hidden md:opacity-0 md:border-none' : 'md:w-72'}
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

            <div className={`px-6 py-4 md:py-6 border-b border-gray-50 flex items-center justify-between min-w-[288px]`}>
              <h3 className="text-[11px] md:text-sm font-black text-gray-900 uppercase tracking-tight">
                {activeTab === 'design' ? 'Image Assets' : activeTab === 'text' ? 'Text Engine' : activeTab === 'layers' ? 'Layer Management' : 'Global Settings'}
              </h3>
              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden md:block p-1 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Collapse Sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-visible min-w-[288px]">
              {activeTab === 'layers' ? (
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

          {/* Canvas Main Area */}
          <div className="flex-1 relative flex flex-col bg-[#f0f2f5] overflow-hidden">
            {/* Left Sidebar Collapse Toggle Switch - For Desktop */}
            {isSidebarCollapsed && (
              <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden md:flex absolute top-6 left-6 z-[60] p-2.5 bg-white shadow-xl rounded-xl text-indigo-600 hover:scale-110 active:scale-95 transition-all border border-indigo-50"
              >
                <PanelLeftOpen size={20} />
              </button>
            )}

            {/* Right Sidebar Collapse Toggle Switch - For Desktop */}
            {isRightSidebarCollapsed && selectedId && (
              <button 
                onClick={() => setIsRightSidebarCollapsed(false)}
                className="hidden lg:flex absolute top-6 right-6 z-[60] p-2.5 bg-white shadow-xl rounded-xl text-indigo-600 hover:scale-110 active:scale-95 transition-all border border-indigo-50"
              >
                <PanelRightOpen size={20} />
              </button>
            )}

            {/* Mobile Property Panel Toggle */}
            {selectedId && (
              <button 
                onClick={() => {
                  const propPanel = document.getElementById('mobile-property-panel');
                  if (propPanel) propPanel.classList.remove('translate-y-full');
                }}
                className="lg:hidden absolute top-20 right-4 z-[45] p-3 bg-white shadow-xl rounded-2xl text-indigo-600 border border-indigo-50 animate-bounce"
              >
                <Settings2 size={20} />
              </button>
            )}

            <CanvasArea 
              template={currentTemplate} 
              elements={elements} 
              selectedId={selectedId} 
              activeViewId={activeViewId}
              onSelect={handleCanvasSelect}
              onViewChange={handleViewSwitch}
              captureRef={canvasCaptureRef}
            />

            {/* Top View Selector Bar - Card Style with Background */}
            {currentTemplate.views && currentTemplate.views.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-2">
                <div className="">
                  <div className="flex items-center justify-center gap-3">
                    {currentTemplate.views.map((view) => {
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
                              alt={view.view_name} 
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
                                {view.view_name}
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
              </div>
            )}

            {/* Quick Trash Bin - Only visible while dragging */}
            {isDragging && (
              <div 
                id="canvas-trash-bin"
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
                    className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-0 relative group overflow-hidden transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 shadow-sm"
                    title="Click to view full preview"
                  >
                    <img 
                      src={livePreviewUrl || (currentTemplate?.image_url || '')} 
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                      alt="mini" 
                    />
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                      <Maximize2 size={16} className="text-indigo-600 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" />
                    </div>
                  </button>
                  <div className="text-left min-w-0">
                    <p className="font-black text-gray-900 text-[10px] md:text-xs truncate">{currentTemplate?.name || 'Designing...'}</p>
                    <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                      <span className="text-[9px] md:text-[10px] font-black text-indigo-600 bg-indigo-100/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-widest leading-none flex items-center gap-0.5">
                        $
                        <span className="ml-0.5">{currentTemplate?.price || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="bg-indigo-600 text-white px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {isSaving ? "Saving..." : <><Save size={16} /> <span className="hidden xs:inline">{isEditing ? 'UPDATE DESIGN' : 'SAVE DESIGN'}</span><span className="xs:hidden">{isEditing ? 'UPDATE' : 'SAVE'}</span></>}
                </button>
              </div>
            </div>

            {/* Mobile Property Panel Drawer */}
            <div 
              id="mobile-property-panel"
              className="lg:hidden absolute inset-x-0 bottom-0 z-[1000] bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-gray-100 translate-y-full transition-transform duration-500 max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-gray-50 z-10">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2"></div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Element Properties</h4>
                <button 
                  onClick={() => document.getElementById('mobile-property-panel')?.classList.add('translate-y-full')}
                  className="p-2 bg-gray-50 rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
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
              bg-white border-l border-gray-100 flex flex-col h-full z-20 transition-all duration-300 ease-in-out hidden lg:flex
              ${isRightSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 border-none' : 'w-72'}
            `}
          >
            <div className="px-6 py-4 md:py-6 border-b border-gray-50 flex items-center justify-between min-w-[288px]">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Properties</h3>
              <button 
                onClick={() => setIsRightSidebarCollapsed(true)}
                className="p-1 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Collapse Panel"
              >
                <PanelRightClose size={18} />
              </button>
            </div>
            <div className="flex-1 min-w-[288px] overflow-y-auto custom-scrollbar">
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
      {/* Full Design Preview Modal */}
      {isPreviewModalOpen && currentTemplate && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300 bg-gray-200 backdrop-blur-xl"
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md hover:bg-white text-gray-600 rounded-full transition-all z-20 shadow-lg border border-gray-100"
            >
              <X size={24} />
            </button>
            <div className="w-full aspect-[4/5] max-h-[80vh] flex items-center justify-center bg-white p-4">
              <img 
                src={livePreviewUrl || currentTemplate.image_url} 
                className="w-full h-full object-contain drop-shadow-2xl" 
                alt="Mockup Preview" 
              />
            </div>
            <div className="w-full p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{currentTemplate.name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{currentTemplate.sku}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sale Price</span>
                <span className="text-2xl font-black text-indigo-600">${currentTemplate.price}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMockupModal;
