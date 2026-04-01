import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Printer, Truck, CheckCircle, Package, User, CreditCard, Calendar, ArrowRight, ExternalLink } from 'lucide-react';

const OrderDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const order = {
    id: id,
    customer: 'Alex Johnson',
    email: 'alex.j@example.com',
    date: '2023-11-24 14:30',
    status: 'Processing',
    total: '$85.50',
    shipping_method: 'Standard Shipping',
    payment_method: 'TiinWallet',
    items: [
      { id: 1, name: 'Premium Cotton T-Shirt', qty: 2, price: '$24.99', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=100' },
      { id: 2, name: 'Eco-Friendly Tote Bag', qty: 1, price: '$12.00', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100' },
      { id: 3, name: 'Ceramic Mug 11oz', qty: 1, price: '$15.50', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=100' },
    ],
    timeline: [
      { status: 'Order Placed', date: 'Nov 24, 2023 14:30', done: true },
      { status: 'Payment Confirmed', date: 'Nov 24, 2023 14:35', done: true },
      { status: 'Processing', date: 'Nov 24, 2023 16:00', done: true },
      { status: 'Shipped', date: 'Pending', done: false },
    ]
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/orders')}
          className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('order')} #{id}</h1>
          <p className="text-gray-500 font-medium">{t('order_details_desc')}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm text-sm uppercase tracking-widest">
            <Printer size={18} />
            <span>{t('print_invoice')}</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-sm uppercase tracking-widest">
            <Truck size={18} />
            <span>{t('ship_order')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items Table */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">{t('order_items')}</h3>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-gray-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('qty')}: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">{item.price}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('subtotal')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
               <div className="flex justify-between items-center text-gray-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('subtotal')}</span>
                  <span className="font-bold">$78.48</span>
               </div>
               <div className="flex justify-between items-center text-gray-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('shipping')}</span>
                  <span className="font-bold">$7.02</span>
               </div>
               <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{t('total')}</span>
                  <span className="text-xl font-black text-indigo-600">{order.total}</span>
               </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8 font-black uppercase tracking-tight mb-8">{t('order_history')}</h3>
             <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-200 before:to-transparent">
                {order.timeline.map((step, i) => (
                   <div key={i} className="relative flex items-center justify-between pl-12 group">
                      <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${step.done ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                         {step.done ? <CheckCircle size={16} className="text-white" /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                      </div>
                      <div className="flex flex-col">
                         <span className={`text-sm font-black uppercase tracking-tight ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</span>
                         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{step.date}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Customer Info */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-indigo-600">
                 <User size={20} />
                 <h3 className="text-sm font-black uppercase tracking-widest">{t('customer')}</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 uppercase">AJ</div>
                    <div>
                       <p className="font-extrabold text-gray-900 uppercase tracking-tight">{order.customer}</p>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{order.email}</p>
                    </div>
                 </div>
                 <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">
                    <span>{t('view_profile')}</span>
                    <ExternalLink size={14} />
                 </button>
              </div>
           </div>

           {/* Payment & Shipping */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <CreditCard size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">{t('payment')}</h3>
                 </div>
                 <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                    <p className="text-sm font-black text-indigo-600 uppercase tracking-tight">{order.payment_method}</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Transaction ID: TXN_987654321</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-indigo-600">
                    <Truck size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest">{t('shipping')}</h3>
                 </div>
                 <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700">{order.shipping_method}</p>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">123 Street Ave, Building 4<br/>California, CA 90001<br/>United States</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
