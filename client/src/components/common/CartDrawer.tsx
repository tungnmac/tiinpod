import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard as CheckoutIcon, 
  RefreshCcw 
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartDrawer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatCurrency, convertAmount, currentLang } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const calculateTotal = () => {
    const targetCurrency = currentLang.startsWith('en') ? 'USD' : 'VND';
    return items.reduce((sum, item) => {
      const convertedPrice = convertAmount(item.price, item.currency || 'USD', targetCurrency, item.exchangeRate);
      return sum + (convertedPrice * item.quantity);
    }, 0);
  };

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsOpen(false);
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => setIsOpen(false)} 
      />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{t('your_cart')}</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{items.length} {t('items_selected')}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-900 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="bg-gray-50 p-12 rounded-[3rem] border border-dashed border-gray-200">
                <ShoppingCart size={64} className="text-gray-200" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 uppercase italic">{t('empty_cart')}</h3>
                <p className="text-sm text-gray-400 font-medium max-w-[200px] mx-auto">{t('empty_cart_desc')}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
              >
                {t('start_shopping')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-28 h-28 bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm relative group-hover:shadow-md transition-all">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-gray-900 uppercase italic text-sm tracking-tight line-clamp-1">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('unit_price')}: {formatCurrency(item.price, item.currency || 'USD', item.exchangeRate)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-indigo-600 font-black text-xl tracking-tighter">{formatCurrency(item.price * item.quantity, item.currency || 'USD', item.exchangeRate)}</p>
                    <div className="flex items-center bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="p-1.5 hover:bg-white rounded-lg shadow-sm transition-all text-gray-500 hover:text-indigo-600 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="p-1.5 hover:bg-white rounded-lg shadow-sm transition-all text-gray-500 hover:text-indigo-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6 rounded-t-[3rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-500 font-black uppercase text-[10px] tracking-widest px-1">
              <span>{t('subtotal')}</span>
              <span>{formatCurrency(calculateTotal(), currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
            </div>
            <div className="flex justify-between text-gray-900 text-3xl font-black italic tracking-tighter px-1">
              <span>{t('total')}</span>
              <span>{formatCurrency(calculateTotal(), currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleCheckout}
              disabled={items.length === 0 || isLoading}
              className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-black transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              {isLoading ? (
                <RefreshCcw size={20} className="animate-spin" />
              ) : (
                <>
                  <CheckoutIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                  {t('complete_checkout')}
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] text-gray-400 text-center font-black uppercase tracking-[0.2em] leading-none">Military-grade encrypted ssl</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
