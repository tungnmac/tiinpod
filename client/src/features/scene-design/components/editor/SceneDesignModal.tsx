import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, 
  Trash2, 
  Save, 
  Maximize2, 
  Image as ImageIcon,
  Type,
  Layout,
  Plus,
  RefreshCcw,
  Undo2,
  Redo2,
  Settings2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ChevronDown,
  ArrowLeft,
  CloudUpload,
  Sparkles
} from 'lucide-react';
import api from '../../../../services/api';
import { sceneService } from '../../../../services/sceneService';

import { SceneObject, SceneTemplate } from '../../types/scene';
import { SceneCanvas } from './SceneCanvas';
import { ScenePropertyPanel } from './ScenePropertyPanel';

interface SceneDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: SceneTemplate;
  onBackToSelection?: () => void;
}

export const SceneDesignModal: React.FC<SceneDesignModalProps> = ({
  isOpen,
  onClose,
  initialTemplate,
  onBackToSelection
}) => {
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<SceneObject[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [activeTab, setActiveTab] = useState('elements');
  const [assets, setAssets] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const canvasCaptureRef = useRef<HTMLDivElement>(null);

  const currentTemplate = initialTemplate || {
      id: 0,
      name: 'Modern Tea Room',
      category: 'tea-room',
      thumbnail_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200&h=150&auto=format&fit=crop',
      background_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=1200'
  };

  // History management
  const saveToHistory = (newObjects: SceneObject[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...newObjects]);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setObjects([...history[prevStep]]);
      setHistoryStep(prevStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setObjects([...history[nextStep]]);
      setHistoryStep(nextStep);
    }
  };

  useEffect(() => {
    // Initial history
    if (objects.length === 0 && history.length === 0) {
      saveToHistory([]);
    }
  }, []);

  useEffect(() => {
    // Fetch assets from API
    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const data = await sceneService.getAssets();
        if (data) {
          setAssets(data);
        }
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchAssets();
  }, []);

  const selectedObject = objects.find(o => o.id === selectedId);

  useEffect(() => {
    // Reset objects when template changes
    setObjects([]);
    setSelectedId(null);
    setHistory([]);
    setHistoryStep(-1);
    saveToHistory([]);
  }, [currentTemplate?.id]);

  // Dragging state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const addObject = (url: string, type: 'furniture' | 'decor' | 'text' | 'image' = 'furniture', text?: string) => {
    const newObj: SceneObject = {
      id: `obj_${Date.now()}`,
      type,
      url: url || '',
      text: text || (type === 'text' ? 'Double click to edit' : ''),
      x: 50,
      y: 50,
      scale: 1,
      rotate: 0,
      opacity: 100,
      zIndex: objects.length + 1,
      isVisible: true,
      flipX: false,
      width: type === 'text' ? undefined : 250,
      fontSize: type === 'text' ? 32 : undefined,
      fontWeight: type === 'text' ? 'bold' : undefined,
      color: type === 'text' ? '#000000' : undefined
    };
    const newObjects = [...objects, newObj];
    setObjects(newObjects);
    saveToHistory(newObjects);
    setSelectedId(newObj.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        addObject(url, 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const updateObject = (id: string, updates: Partial<SceneObject>, skipHistory = false) => {
    setObjects(prev => {
      const newObjects = prev.map(o => o.id === id ? { ...o, ...updates } : o);
      if (!skipHistory) saveToHistory(newObjects);
      return newObjects;
    });
  };

  const deleteObject = (id: string) => {
    setObjects(prev => {
      const newObjects = prev.filter(o => o.id !== id);
      saveToHistory(newObjects);
      return newObjects;
    });
    if (selectedId === id) setSelectedId(null);
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    setSelectedId(id);
    setIsRightSidebarCollapsed(false); // Auto open properties
    const obj = objects.find(o => o.id === id);
    if (!obj) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - obj.x, y: e.clientY - obj.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !selectedId) return;
      
      setObjects(prev => {
        const obj = prev.find(o => o.id === selectedId);
        if (!obj) return prev;
        
        const newObjects = prev.map(o => o.id === selectedId ? {
          ...o,
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        } : o);
        
        return newObjects;
      });
    };

    const handleMouseUp = () => {
        if (isDragging.current) {
          // At the end of drag, we save the FINAL state to history once
          setObjects(current => {
            saveToHistory(current);
            return current;
          });
        }
        isDragging.current = false;
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen, selectedId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (canvasCaptureRef.current) {
        const captureEl = canvasCaptureRef.current.querySelector('[data-capture-container="true"]') as HTMLElement;
        const canvas = await html2canvas(captureEl, { 
          useCORS: true, 
          scale: 2,
          backgroundColor: '#ffffff'
        });
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        console.log("Saving scene snapshot...", dataUrl.substring(0, 50));
        alert("Interior Design saved successfully!");
        onClose();
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  console.log(assets)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1a1c] h-screen w-screen flex flex-col font-sans antialiased overflow-hidden">
      {/* CANVA-STYLE TOP BAR */}
      <header className="h-[64px] bg-[#252627] border-b border-white/10 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToSelection}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white leading-none flex items-center gap-2">
              Untitled Interior - {currentTemplate.name}
              <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">PRO</span>
            </h1>
            <p className="text-[11px] text-white/40 font-medium">Auto-saved to your designs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-xl p-1 mr-2">
            <button 
              onClick={undo}
              disabled={historyStep <= 0}
              className={`p-2 transition-colors ${historyStep <= 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white'}`}
            >
              <Undo2 size={18} />
            </button>
            <button 
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className={`p-2 transition-colors ${historyStep >= history.length - 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white'}`}
            >
              <Redo2 size={18} />
            </button>
          </div>
          <button 
            onClick={() => {
              setObjects([]);
              saveToHistory([]);
              setSelectedId(null);
            }}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-white/90 hover:bg-white/10 rounded-xl font-bold text-sm transition-all border border-white/10"
          >
            <RefreshCcw size={16} /> Reset
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-[#8b3dff] hover:bg-[#7a26ff] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-purple-900/20 flex items-center gap-2 transition-all active:scale-95"
          >
            {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <><Sparkles size={18} /> Finish Design</>}
          </button>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* CANVA-STYLE LEFT SIDEBAR NAVIGATION */}
        <aside className="w-[72px] bg-[#18191b] border-r border-white/5 flex flex-col items-center py-4 shrink-0 overflow-y-auto">
          {[
            { id: 'templates', icon: Layout, label: 'Templates' },
            { id: 'elements', icon: Plus, label: 'Elements' },
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'brand', icon: ImageIcon, label: 'Brand' },
            { id: 'uploads', icon: CloudUpload, label: 'Uploads' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarCollapsed(false);
              }}
              className={`w-full flex flex-col items-center justify-center py-4 gap-1.5 transition-all hover:bg-white/5 ${activeTab === item.id ? 'text-white border-l-2 border-[#8b3dff] bg-white/5' : 'text-white/40'}`}
            >
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-white/5 w-full flex justify-center">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-white/40 hover:text-white p-4"
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        </aside>

        {/* ASSET PANEL (Nested inside sidebar area) */}
        {!isSidebarCollapsed && (
          <div className="w-[320px] bg-[#252627] flex flex-col shrink-0 border-r border-white/10 animate-in slide-in-from-left duration-300">
            <div className="p-5">
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full bg-[#1e1f20] border-none text-white text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 placeholder:text-white/20 font-medium" 
                />
              </div>
              
              <div className="space-y-6">
                {activeTab === 'elements' && (
                  <section>
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Graphics & Furniture</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {loadingAssets ? (
                        <div className="col-span-2 flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                      ) : assets.length > 0 ? (
                        assets.map(asset => (
                          <button 
                            key={asset.id} 
                            onClick={() => addObject(asset.url, asset.category as any)}
                            className="aspect-square bg-[#1e1f20] rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group relative"
                          >
                            <img src={asset.url} alt={asset.name} className="w-full h-full object-contain p-2 transition-transform group-hover:scale-110" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] font-bold text-white truncate text-center uppercase tracking-tighter">{asset.name}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8 text-white/40 text-xs">
                          No assets found. Run seed script first.
                        </div>
                      )}
                      <div className="aspect-square bg-[#1e1f20] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                        <CloudUpload className="text-white/20 mb-1" size={24} />
                        <span className="text-xs font-bold text-white/20">Upload</span>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'templates' && (
                  <div className="text-center py-12">
                    <Layout className="text-white/10 mx-auto mb-3" size={48} />
                    <p className="text-xs font-bold text-white/40">Room templates coming soon</p>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Add Typography</h4>
                    <button 
                      onClick={() => addObject('', 'text', 'Add a heading')}
                      className="w-full py-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-2xl transition-all border border-white/5"
                    >
                      Add Heading
                    </button>
                    <button 
                      onClick={() => addObject('', 'text', 'Add a subheading')}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all border border-white/5"
                    >
                      Add Subheading
                    </button>
                    <button 
                      onClick={() => addObject('', 'text', 'Add a body text')}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium text-sm transition-all border border-white/5"
                    >
                      Add body text
                    </button>
                  </div>
                )}

                {activeTab === 'uploads' && (
                  <div className="space-y-4">
                    <label className="w-full aspect-square bg-purple-600/10 hover:bg-purple-600/20 border-2 border-dashed border-purple-500/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group">
                      <CloudUpload className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={48} />
                      <span className="text-sm font-bold text-white">Upload Image</span>
                      <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-black">PNG, JPG up to 10MB</p>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>

                    <div className="pt-4">
                       <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Your Uploads</h4>
                       <div className="grid grid-cols-2 gap-3">
                        {objects
                          .filter(o => o.type === 'image' && o.url && o.url.startsWith('data:'))
                          .reduce((acc, obj) => {
                            if (!acc.find(a => a.url === obj.url)) acc.push(obj);
                            return acc;
                          }, [] as typeof objects)
                          .map(obj => (
                           <button 
                             key={obj.id}
                             onClick={() => addObject(obj.url || '', 'image')}
                             className="aspect-square bg-[#1e1f20] rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group"
                           >
                             <img src={obj.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Upload" />
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl p-5 border border-purple-500/20">
                  <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-400" />
                    AI Magic Editor
                  </h4>
                  <p className="text-[10px] text-white/60 mb-4 leading-relaxed font-medium">Re-style this room using AI-powered furniture replacement.</p>
                  <button className="w-full bg-white text-black py-2.5 rounded-xl text-xs font-black shadow-lg shadow-black/20 hover:scale-[1.02] transition-all uppercase tracking-widest">
                    Generate Scene
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CANVA-STYLE DARK CANVAS AREA */}
        <main className="flex-1 bg-[#1a1a1c] relative flex flex-col overflow-hidden">
          {/* Editor Toolbar (Floating or Top) */}
          {selectedId && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#252627] text-white h-12 flex items-center px-2 rounded-xl shadow-2xl border border-white/10 z-[100] animate-in zoom-in-95 duration-200">
               <button className="p-2.5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all uppercase tracking-tight px-4">Edit Image</button>
               <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
               <button className="p-2.5 hover:bg-white/10 rounded-lg transition-all" title="Flip Horizontal"><RefreshCcw size={16} /></button>
               <button className="p-2.5 hover:bg-white/10 rounded-lg transition-all" title="Layer Position"><Layout size={16} /></button>
               <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
               <button 
                onClick={() => deleteObject(selectedId)} 
                className="p-2.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          )}

          <div className="flex-1 w-full h-full p-12 overflow-y-auto">
            <div className="w-full h-full flex items-center justify-center">
              <SceneCanvas 
                backgroundUrl={currentTemplate.background_url}
                objects={objects}
                selectedId={selectedId}
                onSelect={handleSelect}
                captureRef={canvasCaptureRef}
              />
            </div>
          </div>

          <footer className="h-10 bg-[#18191b] border-t border-white/5 flex items-center justify-between px-6 shrink-0">
             <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Scene Stats: {objects.length} Elements</div>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-white/40 text-[11px] font-bold">
                  <button className="hover:text-white transition-colors">Grid</button>
                  <button className="hover:text-white transition-colors">Rulers</button>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <div className="flex items-center gap-4 text-white/40">
                  <button className="hover:text-white"><Maximize2 size={16} /></button>
                  <span className="text-xs font-black">100%</span>
                </div>
             </div>
          </footer>
        </main>

        {/* PROPERTY CONFIG PANEL (Like Interior AI / Canva Sidebar) */}
        {!isRightSidebarCollapsed && selectedId && (
          <aside className="w-[300px] bg-[#252627] border-l border-white/10 flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Object Properties</h3>
              <button 
                onClick={() => setIsRightSidebarCollapsed(true)} 
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 transition-all"
              >
                <PanelRightClose size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ScenePropertyPanel 
                selectedObject={selectedObject || null}
                onUpdate={updateObject}
                onDelete={deleteObject}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default SceneDesignModal;
