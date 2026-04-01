import React, { memo } from 'react';
import { 
  Settings2, 
  Trash2, 
  RotateCw, 
  Maximize2, 
  Type, 
  Baseline, 
  Palette,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  RotateCcw,
  Type as TypeIcon,
  MousePointer2,
  Move,
  ArrowUpCircle,
  ArrowDownCircle,
  Divide
} from 'lucide-react';
import { DesignElement } from '../../../../types/product';

const FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Oswald', 
  'Montserrat', 'Playfair Display', 'Bebas Neue', 'Pacifico',
  'Permanent Marker', 'Dancing Script', 'Alfa Slab One'
];

interface PropertyPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (id: string, updates: Partial<DesignElement>, skipHistory?: boolean) => void;
  onDelete: (id: string) => void;
  onSaveHistory: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = memo(({
  selectedElement,
  onUpdateElement,
  onDelete,
  onSaveHistory
}) => {
  if (!selectedElement) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white border-l border-gray-100">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Settings2 size={24} className="text-gray-300" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">No Element Selected</h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Select an element to customize</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white border-l border-gray-100 flex flex-col animate-in slide-in-from-right-5">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 leading-none">Customize</h3>
          <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1 block">
            {selectedElement.type} Element
          </span>
        </div>
        <button 
          onClick={() => onDelete(selectedElement.id)}
          className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Common Controls: Transform */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Maximize2 size={12} /> Transform
          </h4>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-700 font-bold uppercase">Scale: {(selectedElement.scale * 100).toFixed(0)}%</label>
              </div>
              <input 
                type="range" min="0.1" max="5" step="0.05"
                value={selectedElement.scale}
                onChange={(e) => onUpdateElement(selectedElement.id, { scale: parseFloat(e.target.value) }, true)}
                onMouseUp={() => onSaveHistory()}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-indigo-600"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-700 font-bold uppercase text-left">Rotation: {selectedElement.rotate}°</label>
              </div>
              <input 
                type="range" min="0" max="360"
                value={selectedElement.rotate}
                onChange={(e) => onUpdateElement(selectedElement.id, { rotate: parseInt(e.target.value) }, true)}
                onMouseUp={() => onSaveHistory()}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* Text-Specific Controls */}
        {selectedElement.type === 'text' && (
          <section className="space-y-4 pt-4 border-t border-gray-50">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Type size={12} /> Text Styling
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-700 font-bold uppercase text-left">Font Family</label>
                <select 
                  value={selectedElement.fontFamily || 'Inter'}
                  onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                  onBlur={() => onSaveHistory()}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white transition-all appearance-none"
                  style={{ fontFamily: selectedElement.fontFamily }}
                >
                  {FONTS.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                  ))}
                </select>
              </div>

              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 items-center justify-between">
                <button 
                  onClick={() => onUpdateElement(selectedElement.id, { fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  onMouseUp={() => onSaveHistory()}
                  className={`p-2 rounded-lg flex-1 flex justify-center transition-all ${selectedElement.fontWeight === 'bold' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button 
                  onClick={() => onUpdateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  onMouseUp={() => onSaveHistory()}
                  className={`p-2 rounded-lg flex-1 flex justify-center transition-all ${selectedElement.fontStyle === 'italic' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <button 
                  onClick={() => onUpdateElement(selectedElement.id, { textDecoration: selectedElement.textDecoration === 'underline' ? 'none' : 'underline' })}
                  onMouseUp={() => onSaveHistory()}
                  className={`p-2 rounded-lg flex-1 flex justify-center transition-all ${selectedElement.textDecoration === 'underline' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Underline"
                >
                  <Underline size={16} />
                </button>
              </div>

              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 items-center justify-between">
                <button 
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'left' })}
                  onMouseUp={() => onSaveHistory()}
                  className={`p-2 rounded-lg flex-1 flex justify-center transition-all ${selectedElement.textAlign === 'left' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </button>
                <button 
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'center' })}
                  onMouseUp={() => onSaveHistory()}
                  className={`p-2 rounded-lg flex-1 flex justify-center transition-all ${selectedElement.textAlign === 'center' || !selectedElement.textAlign ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </button>
                <button 
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'right' })}
                  onMouseUp={() => onSaveHistory()}
                  className={`p-2 rounded-lg flex-1 flex justify-center transition-all ${selectedElement.textAlign === 'right' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </button>
              </div>

              <div className="space-y-3 pt-2 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700 font-bold uppercase">Max Width: {selectedElement.maxWidth || 300}px</label>
                </div>
                <input 
                  type="range" min="50" max="600" step="10"
                  value={selectedElement.maxWidth || 300}
                  onChange={(e) => onUpdateElement(selectedElement.id, { maxWidth: parseInt(e.target.value) }, true)}
                  onMouseUp={() => onSaveHistory()}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-indigo-600"
                />
              </div>

              <div className="space-y-4 pt-2 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700 font-bold uppercase flex items-center gap-2">
                    <Divide size={12} className="text-indigo-500" /> Text Curve: {selectedElement.curve || 0}
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onUpdateElement(selectedElement.id, { curve: 40 })}
                      className="p-1 px-2 text-[8px] font-black uppercase bg-gray-50 border border-gray-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-1"
                    >
                      <ArrowDownCircle size={10} /> Arc Down
                    </button>
                    <button 
                      onClick={() => onUpdateElement(selectedElement.id, { curve: -40 })}
                      className="p-1 px-2 text-[8px] font-black uppercase bg-gray-50 border border-gray-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-1"
                    >
                      <ArrowUpCircle size={10} /> Arc Up
                    </button>
                    <button 
                      onClick={() => onUpdateElement(selectedElement.id, { curve: 0 })}
                      className="p-1 px-2 text-[8px] font-black uppercase bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      Flat
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${selectedElement.curve && selectedElement.curve < 0 ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300'}`}>
                    <ArrowUpCircle size={20} />
                  </div>
                  <input 
                    type="range" min="-100" max="100" step="1"
                    value={selectedElement.curve || 0}
                    onChange={(e) => onUpdateElement(selectedElement.id, { curve: parseInt(e.target.value) }, true)}
                    onMouseUp={() => onSaveHistory()}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none accent-indigo-600"
                  />
                  <div className={`p-2 rounded-lg ${selectedElement.curve && selectedElement.curve > 0 ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300'}`}>
                    <ArrowDownCircle size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-700 font-bold uppercase text-left">Content</label>
                <textarea 
                  value={selectedElement.text}
                  onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
                  onBlur={() => onSaveHistory()}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  rows={3}
                  placeholder="Enter your text..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] text-gray-700 font-bold uppercase flex items-center gap-1.5">
                    <Baseline size={10} /> Font Size
                  </label>
                  <input 
                    type="number" min="8" max="200"
                    value={selectedElement.fontSize}
                    onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                    onBlur={() => onSaveHistory()}
                   className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] text-gray-700 font-bold uppercase flex items-center gap-1.5">
                    <Palette size={10} /> Color
                  </label>
                  <input 
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                    onInput={() => {}} 
                    onBlur={() => onSaveHistory()}
                    className="w-full h-10 p-1 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Visibility & Opacity */}
        <section className="space-y-4 pt-4 border-t border-gray-50">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Appearance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-700 font-bold uppercase">Opacity: {selectedElement.opacity}%</label>
            </div>
            <input 
              type="range" min="0" max="100"
              value={selectedElement.opacity}
              onChange={(e) => onUpdateElement(selectedElement.id, { opacity: parseInt(e.target.value) }, true)}
              onMouseUp={() => onSaveHistory()}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-indigo-600"
            />
          </div>
        </section>
      </div>
    </div>
  );
});
