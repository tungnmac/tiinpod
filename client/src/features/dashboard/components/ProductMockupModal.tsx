import React, { useState, useRef } from 'react';
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
  Maximize2
} from 'lucide-react';
import { savedTemplateService } from '../../../services/savedTemplateService';

interface ProductTemplate {
  id: number;
  name: string;
  sku: string;
  image: string;
  profit: number;
  rate: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  price: number;
}

interface ProductMockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProductTemplate | null;
  onChangeProduct?: () => void;
  initialDesign?: {
    id?: number;
    name?: string;
    design_data?: string;
  };
}

const ProductMockupModal: React.FC<ProductMockupModalProps> = ({ 
  isOpen, 
  onClose, 
  template,
  onChangeProduct,
  initialDesign
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'text' | 'settings'>('design');
  const [designs, setDesigns] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotate: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Load initial design if editing
  React.useEffect(() => {
    if (isOpen && initialDesign?.design_data) {
      try {
        const data = JSON.parse(initialDesign.design_data);
        if (data.transform) setTransform(data.transform);
        if (data.designs) setDesigns(data.designs.map((d: any, i: number) => ({ id: i, ...d })));
      } catch (e) {
        console.error("Failed to parse design data", e);
      }
    } else if (isOpen) {
      // Reset state for new design
      setDesigns([]);
      setTransform({ x: 0, y: 0, scale: 0.5, rotate: 0 });
    }
  }, [isOpen, initialDesign]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !template) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDesigns([{ id: Date.now(), url: event.target?.result }]);
        setTransform({ x: 0, y: 0, scale: 0.5, rotate: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (designs.length === 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (designs.length === 0) return;
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(2, prev.scale + delta))
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const designData = JSON.stringify({
        transform,
        designs: designs.map(d => ({ url: d.url }))
      });

      await savedTemplateService.saveTemplate({
        id: initialDesign?.id,
        product_template_id: template.id,
        name: initialDesign?.name || `My ${template.name}`,
        preview_image_url: template.image,
        design_data: designData
      });
      
      alert(initialDesign?.id ? "Template updated successfully!" : "Template saved successfully!");
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[70] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-4 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-[#f8f9fb] w-full h-full md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-500">
        
        {/* Header Enhancement */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={onChangeProduct}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 text-sm font-bold transition-all border border-gray-100"
            >
              <RefreshCcw size={16} className="text-indigo-600" />
              Change Product
            </button>
            <div className="h-6 w-[1.5px] bg-gray-100 mx-1"></div>
            <div className="text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Editing Product</span>
              <h2 className="text-base font-extrabold text-gray-900 leading-none">{template.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 transition-all cursor-not-allowed">
                <Undo2 size={18} />
              </button>
              <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 transition-all cursor-not-allowed">
                <Redo2 size={18} />
              </button>
            </div>
            <div className="h-6 w-[1.5px] bg-gray-100 mx-1"></div>
            <button 
              onClick={onClose}
              className="p-2.5 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl text-gray-400 transition-all border border-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Tools */}
          <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full z-20">
            <div className="flex border-b border-gray-100">
              {[
                { id: 'design', icon: Layout, label: 'Design' },
                { id: 'text', icon: Type, label: 'Text' },
                { id: 'settings', icon: Settings2, label: 'Product' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
                    activeTab === tab.id 
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                  >
                    <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900 text-sm">Upload Design</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                  </div>

                  {designs.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase">Transform</span>
                        <button 
                          onClick={() => setTransform({ x: 0, y: 0, scale: 0.5, rotate: 0 })}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100">
                          <RotateCw size={14} className="text-gray-400" />
                          <input 
                            type="range" min="0" max="360" value={transform.rotate}
                            onChange={(e) => setTransform(p => ({ ...p, rotate: parseInt(e.target.value) }))}
                            className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100">
                          <Maximize2 size={14} className="text-gray-400" />
                          <input 
                            type="range" min="0.1" max="2" step="0.01" value={transform.scale}
                            onChange={(e) => setTransform(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                            className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Available Colors</label>
                    <div className="flex gap-2">
                      {template.colors.map((c, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border border-gray-200 ${c} shadow-sm`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 relative flex flex-col bg-[#eaedf2] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16 select-none">
              <div className="relative w-full h-full max-w-2xl aspect-[4/5] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex items-center justify-center">
                 <img src={template.image} alt="mockup" className="w-full h-full object-cover pointer-events-none" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[45%] h-[55%] border-2 border-dashed border-indigo-400/20 rounded-lg overflow-visible">
                    {designs.length === 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30">
                        <Move size={32} className="text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Design Area</span>
                      </div>
                    ) : (
                      <div 
                        onMouseDown={handleMouseDown}
                        onWheel={handleWheel}
                        className={`absolute cursor-move ${isDragging ? 'opacity-90' : 'hover:ring-2 hover:ring-indigo-400'} transition-shadow`}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) 
                                    scale(${transform.scale}) 
                                    rotate(${transform.rotate}deg)`,
                          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <img src={designs[0].url} className="max-w-full max-h-full object-contain pointer-events-none" alt="user design" />
                      </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30">
              <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={template.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-extrabold text-gray-900 text-sm leading-tight">{template.name}</h4>
                    <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Price: ${template.price}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : <><Save size={18} /> Save Template</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMockupModal;
