import React from 'react';
import { X, Star, Plus } from 'lucide-react';

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

interface DesignProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  templates: ProductTemplate[];
  onSelect: (template: ProductTemplate) => void;
}

const DesignProductModal: React.FC<DesignProductModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  templates,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex items-start justify-center p-0 md:p-6 lg:p-10">
      <div className="bg-white w-full h-full md:max-h-[90vh] md:max-w-7xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create your first product</h2>
              <p className="text-xs text-gray-500 font-medium tracking-tight">Select a template to start designing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:border-indigo-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Image Placeholder */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                      <span className="text-xs font-bold text-indigo-700">Profit: ${product.profit}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => onSelect(product)}
                        className="bg-white text-gray-900 px-6 py-2 rounded-xl font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                      >
                        Select Template
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold ml-1">{product.rate}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sku}</span>
                      <span className="text-[10px] text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center gap-1.5">
                        {product.colors.map((color: string, i: number) => (
                          <div key={i} className={`w-3.5 h-3.5 rounded-full border border-gray-200 ${color} shadow-sm`}></div>
                        ))}
                        {product.colors.length > 3 && <span className="text-[10px] font-bold text-gray-400">+{product.colors.length - 3}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-tighter">{size}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-xs text-gray-500 font-medium">Starting from</span>
                        <span className="text-lg font-black text-indigo-600">${product.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignProductModal;
