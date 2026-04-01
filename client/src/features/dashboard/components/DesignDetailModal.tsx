import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Edit2, 
  Trash2,
  Package,
  CheckCircle2,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { UserTemplate } from '../../../types/product';

interface DesignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: UserTemplate | null;
  onEdit: (template: UserTemplate) => void;
  onDelete: (id: number) => void;
}

const DesignDetailModal: React.FC<DesignDetailModalProps> = ({
  isOpen,
  onClose,
  template,
  onEdit,
  onDelete
}) => {
  const [activeView, setActiveView] = useState<string>('');

  if (!isOpen || !template) return null;

  // Parse design data to get snapshots if they exist
  let viewSnapshots: Record<string, string> = {};
  let productViews: any[] = [];
  try {
    const data = JSON.parse(template.design_data || '{}');
    viewSnapshots = data.viewSnapshots || {};
    
    // Get view info from product template
    productViews = template.product_template?.views || [];
    
    // If no view snapshots but elements exist, we might be in legacy mode
    if (Object.keys(viewSnapshots).length === 0 && template.preview_image_url) {
        viewSnapshots['front'] = template.preview_image_url;
    }
  } catch (e) {
    console.error("Failed to parse design data", e);
  }

  // Ensure activeView is set to a valid snapshot key if not already
  const snapshotKeys = Object.keys(viewSnapshots);
  const currentActiveView = activeView && viewSnapshots[activeView] 
    ? activeView 
    : (viewSnapshots['front'] ? 'front' : (snapshotKeys[0] || ''));

  const currentPreview = viewSnapshots[currentActiveView] || template.preview_image_url;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#f8f9fb] w-full max-w-6xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Large Preview Area */}
        <div className="flex-1 bg-white relative flex flex-col items-center justify-center p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 min-h-[40vh] md:min-h-0 overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl transition-all md:hidden z-10"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="w-full h-full relative group">
            <img 
              src={currentPreview} 
              alt={template.name}
              className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700"
            />
          </div>

          {/* View Switcher Controls */}
          {snapshotKeys.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-gray-100 shadow-xl overflow-x-auto max-w-[90%] no-scrollbar">
              {snapshotKeys.map((viewId) => {
                const snapshot = viewSnapshots[viewId];
                const viewInfo = productViews.find(v => v.id === viewId);
                return (
                  <button 
                    key={viewId}
                    onClick={() => setActiveView(viewId)}
                    className={`shrink-0 w-14 h-14 rounded-xl border-2 transition-all overflow-hidden ${
                      currentActiveView === viewId ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={snapshot} className="w-full h-full object-cover" alt={viewInfo?.view_name || viewId} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Details Area */}
        <div className="w-full md:w-[400px] flex flex-col h-full bg-[#f8f9fb]">
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Package size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Product Design</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                {template.name || 'Unnamed Design'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:flex p-3 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all shadow-sm border border-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 no-scrollbar">
            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-gray-400 mb-2 font-bold text-[10px] uppercase tracking-wider">Base Price</div>
                <div className="text-xl font-black text-gray-900 flex items-center gap-1">
                  <DollarSign size={18} className="text-green-500" />
                  {template.product_template?.base_price || '0.00'}
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-gray-400 mb-2 font-bold text-[10px] uppercase tracking-wider">Created At</div>
                <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" />
                  {template.created_at ? new Date(template.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Specifications</h3>
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Tag size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Category</div>
                      <div className="text-sm font-extrabold text-gray-900">Premium Apparel</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Status</div>
                      <div className="text-sm font-extrabold text-gray-900">Custom Template</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

             {/* Description or Additional Info */}
             <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Design Views</h3>
               <div className="grid grid-cols-2 gap-3">
                 {snapshotKeys.map((viewId) => {
                   const viewInfo = productViews.find(v => v.id === viewId);
                   return (
                     <div key={viewId} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                       <CheckCircle2 size={14} className="text-indigo-500" />
                       <span className="text-xs font-bold text-gray-700">{viewInfo?.view_name || viewId}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="p-8 pt-4 bg-white/50 backdrop-blur-md border-t border-gray-100 space-y-3">
            <button 
              onClick={() => onEdit(template)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <Edit2 size={18} />
              Edit Design
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open(currentPreview, '_blank')}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest border border-gray-100 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Maximize2 size={16} /> Preview
              </button>
              <button 
                onClick={() => onDelete(template.id)}
                className="w-16 h-14 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-all flex items-center justify-center"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetailModal;
