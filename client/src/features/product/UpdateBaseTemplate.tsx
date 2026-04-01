import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  Save, 
  Box, 
  Tag, 
  Truck, 
  Layers, 
  DollarSign, 
  Upload,
  X
} from 'lucide-react';

const UpdateBaseTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: isEdit ? 'Premium Cotton T-Shirt' : '',
    category: isEdit ? 'Apparel' : '',
    vendor: isEdit ? 'Printful' : '',
    basePrice: isEdit ? '12.50' : '',
    description: isEdit ? 'High-quality 100% ringspun cotton t-shirt.' : '',
    variants: isEdit ? '34' : '0'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save
    navigate('/templates');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-6 mb-10">
        <button 
          onClick={() => navigate('/templates')}
          className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 group"
        >
          <ChevronLeft size={24} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Box size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('master_data')}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEdit ? 'Update Base Template' : 'Create Base Template'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t('general_info')}</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('base_name')}</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-700"
                  placeholder="e.g. Premium Cotton T-Shirt"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('description')}</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-700 resize-none"
                  placeholder="Describe the base product material, fit, and quality..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Vendor */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                <DollarSign size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Commercial Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('base_price')}</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    className="w-full pl-10 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('provider')}</label>
                <select 
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-700 appearance-none"
                >
                  <option value="">Select Vendor</option>
                  <option value="Printful">Printful</option>
                  <option value="Gelato">Gelato</option>
                  <option value="Printify">Printify</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Organization */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('organization')}</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('category')}</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-700 appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('variants')}</label>
                <input 
                  type="number"
                  value={formData.variants}
                  onChange={(e) => setFormData({...formData, variants: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl">
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3"
            >
              <Save size={18} />
              {isEdit ? t('update_product') : t('create_product')}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/templates')}
              className="w-full mt-4 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateBaseTemplate;
