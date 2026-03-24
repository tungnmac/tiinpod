import React from 'react';
import { Layers, Eye, Trash2, Type, Move } from 'lucide-react';
import { DesignElement } from './types';

interface LayerManagerProps {
  elements: DesignElement[];
  selectedId: string | null;
  deleteConfirmId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  elements,
  selectedId,
  deleteConfirmId,
  onSelect,
  onToggleVisibility,
  onDelete,
  onReorder,
  onCancelDelete,
  onConfirmDelete
}) => {
  const [draggedLayerIndex, setDraggedLayerIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLayerIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedLayerIndex === null || draggedLayerIndex === index) return;
    onReorder(draggedLayerIndex, index);
    setDraggedLayerIndex(index);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
        Layers List
        <span className="text-[9px] font-normal lowercase text-gray-300 italic">Drag to reorder</span>
      </h3>
      {elements.slice().reverse().map((el, revIndex) => {
        const actualIndex = elements.length - 1 - revIndex;
        const isConfirming = deleteConfirmId === el.id;

        return (
          <div key={el.id} className="relative group/layer">
            <div 
              draggable
              onDragStart={(e) => handleDragStart(e, actualIndex)}
              onDragOver={(e) => handleDragOver(e, actualIndex)}
              onDragEnd={() => setDraggedLayerIndex(null)}
              onClick={() => onSelect(el.id)}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-move ${
                selectedId === el.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-gray-300'
              } ${draggedLayerIndex === actualIndex ? 'opacity-40 scale-95 border-dashed border-indigo-400' : ''}`}
            >
              <div className="flex flex-col gap-0.5 text-gray-300 group-hover/layer:text-indigo-400 transition-colors">
                <Move size={10} />
                <Move size={10} />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-50">
                {el.type === 'image' ? (
                  <img src={el.url} className="w-full h-full object-contain" alt="layer thumbnail" />
                ) : (
                  <Type size={16} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {el.type === 'image' ? 'Image Layer' : el.text}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-gray-400 font-black uppercase bg-gray-50 px-1 rounded-sm border border-gray-100">{el.type}</span>
                  {el.viewId && (
                    <span className="text-[9px] text-indigo-500 font-extrabold uppercase bg-indigo-50 px-1 rounded-sm border border-indigo-100">
                      {el.viewId}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover/layer:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleVisibility(el.id); }}
                  className={`p-1.5 rounded-md hover:bg-gray-100 ${el.isVisible ? 'text-gray-400' : 'text-red-400'}`}
                >
                  <Eye size={14} className={el.isVisible ? '' : 'opacity-30'} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}
                  className={`p-1.5 rounded-md transition-all ${isConfirming ? 'bg-red-500 text-white' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Inline Confirmation Popover */}
            {isConfirming && (
              <div className="absolute left-full top-0 ml-2 z-[100] bg-white border border-gray-100 shadow-2xl rounded-2xl p-3 w-44 animate-in slide-in-from-left-2 duration-200 ring-1 ring-black/5">
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight mb-3">Delete this layer?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onCancelDelete(); }}
                    className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg text-[9px] font-black transition-all"
                  >
                    NO
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onConfirmDelete(el.id); }}
                    className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[9px] font-black shadow-lg shadow-red-100 transition-all"
                  >
                    YES, DELETE
                  </button>
                </div>
                <div className="absolute left-0 top-6 -translate-x-full h-0 w-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white drop-shadow-sm"></div>
              </div>
            )}
          </div>
        );
      })}
      {elements.length === 0 && (
        <div className="text-center py-10 opacity-30">
          <Layers size={32} className="mx-auto mb-2" />
          <p className="text-xs font-bold">No Layers Yet</p>
        </div>
      )}
    </div>
  );
};
