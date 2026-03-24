import React, { useState, useMemo } from 'react';
import { X, Star, Plus, LayoutGrid, Shirt, Laptop, Coffee, Glasses, Search, ChevronRight } from 'lucide-react';
import { ProductTemplate } from './mockup-editor/types';

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
  console.log('DesignProductModal rendered with templates:', templates);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { name: 'All Products', icon: LayoutGrid },
    { name: 'Apparel', icon: Shirt },
    { name: 'Home Decor', icon: Coffee },
    { name: 'Accessories', icon: Glasses },
    { name: 'Technology', icon: Laptop },
  ];

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter(template => {
      if (!template) return false;
      const matchCategory = selectedCategory === 'All Products' || (template.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = (template.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (template.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex items-start justify-center p-0 md:p-6 lg:p-10">
      <div className="bg-white w-full h-full md:max-h-[90vh] md:max-w-[1400px] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Plus size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">Create your design</h2>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Select a template to start</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-12 relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search templates or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
            />
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Category List */}
          <div className="w-72 bg-gray-50/50 border-r border-gray-100 flex flex-col p-6 overflow-y-auto">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Marketplace Categories</h3>
            <nav className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    selectedCategory === cat.name 
                    ? 'bg-white shadow-xl shadow-gray-200/50 text-indigo-600 border border-gray-100' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <cat.icon size={18} className={selectedCategory === cat.name ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-700'} />
                    <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat.name ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))}
            </nav>
            
            <div className="mt-12 bg-indigo-50 rounded-3xl p-6 text-left">
               <h4 className="text-xs font-black text-indigo-900 uppercase tracking-tight mb-2">Need Help?</h4>
               <p className="text-[10px] text-indigo-700 font-bold leading-relaxed mb-4">Can't find a product? Request a new template from our fulfillment network.</p>
               <button className="text-[10px] font-black text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all">REQUEST MOCKUP</button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900">{selectedCategory}</h3>
                <p className="text-sm text-gray-500 font-medium">Found {filteredTemplates.length} matching templates</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Warming up engines...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 opacity-30 grayscale">
                 <Search size={48} className="mb-4" />
                 <p className="text-lg font-black">No templates found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTemplates.map((product) => (
                  <div key={product.id} className="group relative flex flex-col h-full">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-[2rem] border border-gray-100 group-hover:border-indigo-200 transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-100/50">
                      <img src={product.image_url || '/placeholder.png'} alt={product.name || 'Product'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white shadow-sm flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Profit: ${product.default_profit || 0}</span>
                      </div>
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <button 
                          onClick={() => onSelect(product)}
                          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/30 transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-indigo-700 active:scale-95"
                        >
                          Select Template
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 px-1 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-gray-900 text-base line-clamp-1 truncate">{product.name || 'Unnamed Product'}</h4>
                        <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[10px] font-black ml-1">{product.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.sku || 'NO SKU'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{product.review_count || 0} reviews</span>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <div className="flex -space-x-1.5 text-[8px] font-bold text-gray-400">
                          {product.colors && typeof product.colors === 'string' ? product.colors.split(',').slice(0, 3).map((color: string, i: number) => (
                            <div key={i} className={`w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-100 shadow-sm flex items-center justify-center`} style={{ backgroundColor: color.trim() }}></div>
                          )) : null}
                          {product.colors && typeof product.colors === 'string' && product.colors.split(',').length > 3 && <span className="ml-1 leading-4">+{product.colors.split(',').length - 3}</span>}
                        </div>
                        <span className="text-sm font-black text-gray-900 tracking-tight">From ${product.base_price || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignProductModal;
