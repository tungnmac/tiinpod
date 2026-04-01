import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Save, X, Image as ImageIcon, Plus, Trash2, Layout } from 'lucide-react';

const UpdateProduct: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: isEdit ? 'Premium Cotton T-Shirt' : '',
    category: isEdit ? 'Apparel' : '',
    price: isEdit ? '24.99' : '',
    sku: isEdit ? 'TS-COT-001' : '',
    stock: isEdit ? 450 : 0,
    status: isEdit ? 'Published' : 'Draft',
    description: isEdit ? 'A high-quality, 100% cotton t-shirt perfect for everyday wear.' : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic
    navigate('/products');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/products')}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {isEdit ? t('edit_product') : t('add_new_product')}
          </h1>
          <p className="text-gray-500 font-medium">{t('configure_product_details')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('general_info')}</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('product_name')}</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
                placeholder="e.g. Premium Cotton T-Shirt"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('description')}</label>
              <textarea 
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-700 resize-none"
                placeholder="Provide a detailed description of your product..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('pricing_inventory')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('base_price')}</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                   <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
                    placeholder="29.99"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</label>
                <input 
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
                  placeholder="TS-COT-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('stock_quantity')}</label>
              <input 
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700"
                placeholder="100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Status & Category */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('organization')}</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('status')}</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700 appearance-none cursor-pointer"
              >
                <option value="Published">{t('published')}</option>
                <option value="Draft">{t('draft')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('category')}</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-700 appearance-none cursor-pointer"
              >
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('media')}</h3>
            <div className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
              <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                <ImageIcon size={32} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{t('upload_image')}</span>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            <span>{isEdit ? t('update_product') : t('create_product')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
