import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Printer, Truck, CheckCircle, Package, User, CreditCard, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

const OrderDetail: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const order = {
    id: id,
    customer: 'Alex Johnson',
    email: 'alex.j@example.com',
    date: '2023-11-24 14:30',
    status: 'Processing',
    currency: 'USD',
    totalAmount: 85.50,
    shipping_method: 'Standard Shipping',
    payment_method: 'TiinWallet',
    items: [
      { id: 1, name: 'Premium Cotton T-Shirt', qty: 2, price: 24.99, currency: 'USD', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=100' },
      { id: 2, name: 'Eco-Friendly Tote Bag', qty: 1, price: 12.00, currency: 'USD', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100' },
      { id: 3, name: 'Ceramic Mug 11oz', qty: 1, price: 15.50, currency: 'USD', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=100' },
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
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label={t('go_back')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{t('order_detail')}</h1>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors">
              <Printer className="w-5 h-5" />
              {t('print_order')}
            </button>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">{t('order_info')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('order_id')}</span>
              <p className="text-gray-900 font-bold">{order.id}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('order_date')}</span>
              <p className="text-gray-900 font-bold">{order.date}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('status')}</span>
              <p className="text-gray-900 font-bold">{order.status}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('payment_method')}</span>
              <p className="text-gray-900 font-bold">{order.payment_method}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('shipping_method')}</span>
              <p className="text-gray-900 font-bold">{order.shipping_method}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('customer')}</span>
              <p className="text-gray-900 font-bold">{order.customer}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{t('email')}</span>
              <p className="text-gray-900 font-bold">{order.email}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">{t('order_timeline')}</h3>
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${event.done ? 'bg-indigo-600' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">{event.status}</p>
                  <p className="text-gray-500 text-sm">{event.date}</p>
                </div>
                {!event.done && (
                  <div className="flex-shrink-0">
                    <button className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      {t('mark_as_done')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
                  <p className="font-black text-gray-900">{formatCurrency(item.price, item.currency || 'USD')}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('subtotal')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
             <div className="flex justify-between items-center text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-widest">{t('subtotal')}</span>
                <span className="font-bold">{formatCurrency(78.48, 'USD')}</span>
             </div>
             <div className="flex justify-between items-center text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-widest">{t('shipping')}</span>
                <span className="font-bold">{formatCurrency(7.02, 'USD')}</span>
             </div>
             <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{t('total')}</span>
                <span className="text-xl font-black text-indigo-600">{formatCurrency(order.totalAmount, order.currency || 'USD')}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
