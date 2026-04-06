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
  const canvasCaptureRef = useRef<HTMLDivElement>(null);

  const currentTemplate = initialTemplate || {
      id: 'default-scene',
      name: 'Modern Tea Room',
      category: 'tea-room',
      thumbnail_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200&h=150&auto=format&fit=crop',
      background_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=1200'
  };

  const selectedObject = objects.find(o => o.id === selectedId);

  useEffect(() => {
    // Reset objects when template changes
    setObjects([]);
    setSelectedId(null);
  }, [currentTemplate?.id]);

  // Dragging state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const addObject = (url: string, type: 'furniture' | 'decor' = 'furniture') => {
    const newObj: SceneObject = {
      id: `obj_${Date.now()}`,
      type,
      url,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 100,
      zIndex: objects.length + 1,
      isVisible: true,
      width: 250
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId(newObj.id);
  };

  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteObject = (id: string) => {
    setObjects(prev => prev.filter(o => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    setSelectedId(id);
    const obj = objects.find(o => o.id === id);
    if (!obj) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - obj.x, y: e.clientY - obj.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !selectedId) return;
      updateObject(selectedId, {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    };

    const handleMouseUp = () => {
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

  const ASSETS = [
    { 
      id: 'f1', 
      name: 'Eames Lounge', 
      url: 'https://p7.hiclipart.com/preview/44/127/535/eames-lounge-chair-charles-and-ray-eames-furniture-herman-miller-eames-lounge-chair.jpg', 
      category: 'furniture'
    },
    { 
      id: 'f2', 
      name: 'Nordic Sofa', 
      url: 'https://p7.hiclipart.com/preview/417/30/1004/couch-sofa-bed-living-room-furniture-nordic-sofa.jpg', 
      category: 'furniture'
    },
    { 
      id: 'd1', 
      name: 'Monstera', 
      url: 'https://p7.hiclipart.com/preview/659/54/983/monstera-deliciosa-houseplant-flowerpot-leaf-plant.jpg', 
      category: 'decor'
    },
    { 
      id: 'd2', 
      name: 'Tea Set', 
      url: 'https://p7.hiclipart.com/preview/834/621/530/tea-japanese-cuisine-matcha-ocha-japanese-tea-set.jpg', 
      category: 'decor'
    }
  ];

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
            <button className="p-2 text-white/50 hover:text-white transition-colors"><Undo2 size={18} /></button>
            <button className="p-2 text-white/50 hover:text-white transition-colors"><Redo2 size={18} /></button>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 text-white/90 hover:bg-white/10 rounded-xl font-bold text-sm transition-all border border-white/10">
            <RefreshCcw size={16} /> Reset
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-[#8b3dff] hover:bg-[#7a26ff] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-purple-900/20 flex items-center gap-2 transition-all active:scale-95"
          >
            {isSaving ? <RefreshCcw className="animate-spin" size={18} /> : <><Save size={18} /> Share & Render</>}
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
              className={`w-full flex flex-col items-center justify-center py-4 gap-1.5 transition-all hover:bg-white/5 ${item.id === 'elements' ? 'text-white' : 'text-white/40'}`}
            >
              <item.icon size={24} strokeWidth={item.id === 'elements' ? 2 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-white/5 w-full flex justify-center">
            <button className="text-white/40 hover:text-white p-4">
              <PanelLeftClose size={20} />
            </button>
          </div>
        </aside>

        {/* ASSET PANEL (Nested inside sidebar area) */}
        <div className="w-[320px] bg-[#252627] flex flex-col shrink-0 border-r border-white/10 animate-in slide-in-from-left duration-300">
          <div className="p-5">
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search templates or furniture..." 
                className="w-full bg-[#1e1f20] border-none text-white text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 placeholder:text-white/20 font-medium" 
              />
            </div>
            
            <div className="space-y-6">
              <section>
                <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Graphics & Furniture</h4>
                <div className="grid grid-cols-2 gap-3">
                  {ASSETS.map(asset => (
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
                  ))}
                  <div className="aspect-square bg-[#1e1f20] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                    <CloudUpload className="text-white/20 mb-1" size={24} />
                    <span className="text-xs font-bold text-white/20">Upload</span>
                  </div>
                </div>
              </section>

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
