import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Edit2, Trash2, Package, Tag, Box, DollarSign, BarChart3, Clock, Eye } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data for demo
  const product = {
    id: id,
    name: 'Premium Cotton T-Shirt',
    category: 'Apparel',
    status: 'Published',
    sales: 124,
    stock: 450,
    price: '$24.99',
    description: 'A high-quality, 100% cotton t-shirt perfect for everyday wear. Features a durable construction and comfortable fit.',
    sku: 'TS-COT-001',
    created_at: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600'
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/products')}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('product_details')}</h1>
          <p className="text-gray-500 font-medium">{t('manage_your_product_info')}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button 
            onClick={() => navigate(`/products/${id}/edit`)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm text-sm uppercase tracking-widest"
          >
            <Edit2 size={18} />
            <span>{t('edit')}</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-all shadow-sm text-sm uppercase tracking-widest text-red-500">
            <Trash2 size={18} />
            <span>{t('delete')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
             <div className="flex flex-col md:flex-row gap-8">
               <div className="w-full md:w-80 h-80 rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
               </div>
               <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                        {product.category}
                     </span>
                     <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                        product.status === 'Published' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                     }`}>
                        {product.status === 'Published' ? t('published') : t('draft')}
                     </span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{product.name}</h2>
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t('price')}</span>
                        <span className="text-2xl font-black text-indigo-600 tracking-tight">{product.price}</span>
                     </div>
                     <div className="w-px h-10 bg-gray-100" />
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">SKU</span>
                        <span className="text-lg font-bold text-gray-900">{product.sku}</span>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Description</p>
                     <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
                  </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { icon: <BarChart3 className="text-blue-500" />, label: t('total_sales'), value: product.sales, trend: '+12%' },
               { icon: <Box className="text-purple-500" />, label: t('stock_available'), value: product.stock, trend: 'Normal' },
               { icon: <Eye className="text-orange-500" />, label: t('total_views'), value: '1,240', trend: '+5%' },
             ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                   <div className="p-3 bg-gray-50 rounded-2xl w-fit mb-4">{stat.icon}</div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                   <div className="flex items-end justify-between">
                     <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                     <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">{t('inventory_log')}</h3>
             <div className="space-y-6">
                {[
                  { event: 'Stock Restocked', date: '2 hours ago', qty: '+50' },
                  { event: 'Sold - Order #1234', date: '5 hours ago', qty: '-1' },
                  { event: 'Sold - Order #1233', date: '1 day ago', qty: '-2' },
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-default">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.event}</span>
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.date}</span>
                      </div>
                      <span className={`text-sm font-black ${item.qty.startsWith('+') ? 'text-green-500' : 'text-orange-500'}`}>{item.qty}</span>
                   </div>
                ))}
             </div>
             <button className="w-full mt-8 py-4 bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-2xl border border-gray-100 hover:bg-gray-100 hover:text-gray-900 transition-all">{t('view_all_logs')}</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
