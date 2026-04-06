import React from 'react';
import { SceneObject } from '../../types/scene';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Copy, 
  FlipHorizontal,
  Maximize2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface ScenePropertyPanelProps {
  selectedObject: SceneObject | null;
  onUpdate: (id: string, updates: Partial<SceneObject>) => void;
  onDelete: (id: string) => void;
}

export const ScenePropertyPanel: React.FC<ScenePropertyPanelProps> = ({
  selectedObject,
  onUpdate,
  onDelete
}) => {
  if (!selectedObject) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-white">
        <Maximize2 size={32} className="mb-2 opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-widest">Select an item to edit</span>
      </div>
    );
  }

  const changeZIndex = (delta: number) => {
    onUpdate(selectedObject.id, { zIndex: (selectedObject.zIndex || 0) + delta });
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase">Item Properties</h3>
          <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{selectedObject.type}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Layer Management: Depth Control */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Z-Index (Depth)</h4>
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 items-center justify-between gap-2">
            <button 
              onClick={() => changeZIndex(-1)}
              className="p-2.5 rounded-lg flex-1 flex flex-col items-center justify-center gap-1 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
            >
              <ChevronDown size={14} />
              <span className="text-[8px] font-black uppercase">Send Back</span>
            </button>
            <div className="px-3 py-1 font-black text-indigo-600 text-sm">{selectedObject.zIndex || 0}</div>
            <button 
              onClick={() => changeZIndex(1)}
              className="p-2.5 rounded-lg flex-1 flex flex-col items-center justify-center gap-1 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
            >
              <ChevronUp size={14} />
              <span className="text-[8px] font-black uppercase">Bring Forward</span>
            </button>
          </div>
        </section>

        {/* Visibility & Transform */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transform</h4>
          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => onUpdate(selectedObject.id, { flipX: !selectedObject.flipX })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedObject.flipX ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-500 border-gray-100'}`}
              >
                <FlipHorizontal size={18} />
                <span className="text-[8px] font-black uppercase">Flip Horizontal</span>
             </button>
             <button 
                onClick={() => onDelete(selectedObject.id)}
                className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl flex flex-col items-center gap-2"
              >
                <Trash2 size={18} />
                <span className="text-[8px] font-black uppercase">Delete Item</span>
             </button>
          </div>
          <div className="space-y-3 pt-4">
            <label className="text-[10px] font-black uppercase text-gray-400">Scale: {(selectedObject.scale * 100).toFixed(0)}%</label>
            <input 
              type="range" min="0.1" max="5" step="0.05"
              value={selectedObject.scale}
              onChange={(e) => onUpdate(selectedObject.id, { scale: parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-indigo-600"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
