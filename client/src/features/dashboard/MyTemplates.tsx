import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Search, Filter, Plus, Edit2, Trash2, Calendar, Package, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// Assume savedTemplateService exists as seen in previous context
import { savedTemplateService } from '../../services/savedTemplateService';
import { UserTemplate } from '../../types/product';

const MyTemplates: React.FC = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      if (savedTemplateService?.getMyTemplates) {
        const data = await savedTemplateService.getMyTemplates();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter(tmpl => 
      tmpl.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Layout size={24} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{t('operations')}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('my_templates')}</h1>
          <p className="text-gray-500 font-medium">{t('my_templates_desc')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 focus-within:text-indigo-500" size={18} />
            <input 
              type="text" 
              placeholder={t('search_templates')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-700 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            <Plus size={20} />
            <span>{t('create_template')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-6 space-y-4 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div key={template.id} className="group bg-white rounded-[2rem] border border-gray-100 p-5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1">
              <div className="relative aspect-square mb-5 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50">
                <img 
                  src={template.preview_image_url || 'https://via.placeholder.com/300'} 
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button className="p-3 bg-white text-gray-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors duration-300 shadow-xl">
                    <Eye size={20} />
                  </button>
                  <button className="p-3 bg-white text-gray-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors duration-300 shadow-xl">
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{template.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Calendar size={14} />
                  <span>{new Date(template.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="pt-3 flex items-center justify-between border-t border-gray-50">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {template?.product_template?.category || 'T-Shirt'}
                  </span>
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-gray-50 rounded-full mb-4">
              <Package size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 max-w-xs">{t('my_templates_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTemplates;
