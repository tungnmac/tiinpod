import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Store, Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { storeService } from '../../services/baseService';

const StoresList: React.FC = () => {
  const { t } = useTranslation();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await storeService.getStores();
        setStores(Array.isArray(data) ? data : (data?.data || []));
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filteredStores = useMemo(() => {
    return stores.filter(s => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.platform?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Store size={24} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{t('storefront')}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('stores')}</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-700 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            <Plus size={20} />
            <span>Connect Store</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div key={store.id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                  <Store size={32} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  store.status === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {store.status || 'Active'}
                </span>
              </div>
              
              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{store.name}</h3>
                <p className="text-gray-400 font-medium">{store.platform || 'Shopify'}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <a href={store.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                  Visit Store
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <Store size={48} className="text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No stores connected</h3>
            <p className="text-gray-400 max-w-xs mt-2 font-medium">Connect your e-commerce platform to start publishing products.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoresList;
