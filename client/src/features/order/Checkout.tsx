import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useCurrency } from '../../hooks/useCurrency';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ChevronRight, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService, paymentService } from '../../services/baseService';
import { useAuthStore } from '../../store/useAuthStore';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { formatCurrency, convertAmount, currentLang, rates } = useCurrency();
  
  const [loading, setLoading] = useState(false);
  const [fetchingMethods, setFetchingMethods] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success

  // Saved Methods
  const [savedMethods, setSavedMethods] = useState<any[]>([]);
  
  // Debug to watch savedMethods change
  React.useEffect(() => {
    if (savedMethods.length > 0) {
      console.log('DEBUG: savedMethods updated state:', savedMethods);
    }
  }, [savedMethods]);
  
  // Form States
  const [address, setAddress] = useState('HN');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Credit Card States
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  // Fetch saved methods
  const fetchMethods = async () => {
    setFetchingMethods(true);
    try {
      const data = await paymentService.getSavedMethods({user_id: user?.id, type: paymentMethod });
      console.log('DEBUG: Saved Methods Data received:', data);
      setSavedMethods(data || []);
    } catch (error) {
      console.error('Failed to fetch methods', error);
    } finally {
      setFetchingMethods(false);
    }
  };

  const handleSelectMethod = (type: string) => {
    setPaymentMethod(type);
    const saved = savedMethods.find(m => m.type === type);
    if (saved) {
      if (type === 'credit_card') {
        setCardInfo({
          number: saved.card_number || '',
          name: saved.card_holder || '',
          expiry: saved.expiry_date || '',
          cvc: '' // Don't save CVV
        });
      } else if (type === 'bank_transfer') {
        setBankInfo({
          bankName: saved.bank_name || '',
          accountNumber: saved.account_number || '',
          accountName: saved.account_name || ''
        });
      }
    }
  };

  React.useEffect(() => {
    if (step === 2) fetchMethods();
  }, [step]);
  
  const subtotal = useMemo(() => {
    const targetCurrency = currentLang.startsWith('en') ? 'USD' : 'VND';
    return items.reduce((sum, item) => {
      const convertedPrice = convertAmount(item.price, item.currency || 'USD', targetCurrency, item.exchangeRate);
      return sum + (convertedPrice * item.quantity);
    }, 0);
  }, [items, currentLang, convertAmount]);

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50
  const total = subtotal + tax + shipping - appliedDiscount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'TIINPOD10') {
      setAppliedDiscount(subtotal * 0.1);
      toast.success('Discount applied!');
    } else {
      toast.error('Invalid code');
    }
  };

  const handlePaymentNow = async () => {
    if (!address) {
      toast.error('Please enter shipping address');
      setStep(1);
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'credit_card') {
      if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvc) {
        toast.error('Please fill in searching card information');
        return;
      }
      
      setLoading(true);
      try {
        // Simple card verification check
        const verification = await paymentService.verifyCard({
          card_number: cardInfo.number,
          card_holder: cardInfo.name,
          expiry: cardInfo.expiry,
          cvc: cardInfo.cvc
        });

        if (!verification.success) {
          toast.error(verification.message || 'Card verification failed');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Verification error', error);
        toast.error('Could not verify card details');
        setLoading(false);
        return;
      }
    }
    
    setLoading(true);
    try {
      // Save payment method for next time
      const methodData = paymentMethod === 'credit_card' ? {
        type: 'credit_card',
        card_holder: cardInfo.name,
        card_number: cardInfo.number,
        expiry_date: cardInfo.expiry
      } : {
        type: 'bank_transfer',
        bank_name: 'Vietcombank', // Example
        account_number: '1234567890',
        account_name: 'TIINPOD STORE'
      };
      
      await paymentService.saveMethod(methodData);

      const targetCurrency = currentLang.startsWith('en') ? 'USD' : 'VND';
      const orderData = {
        user_id: user?.id,
        total_amount: subtotal,
        tax_amount: tax,
        shipping_fee: shipping,
        discount_amount: appliedDiscount,
        final_amount: total,
        currency: targetCurrency,
        exchange_rate: rates[targetCurrency] || 1,
        shipping_address: address,
        status: 'pending',
        payment_status: 'unpaid',
        payments: [{
          amount: total,
          currency: targetCurrency,
          payment_method: paymentMethod,
          status: paymentMethod === 'credit_card' ? 'paid' : 'pending'
        }],
        items: items.map(item => ({
          product_id: item.id, // item.id giờ đã là number, đồng nhất với Backend
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
          exchange_rate: item.exchangeRate,
          name: item.name,
          sku: item.sku || ''
        }))
      };

      await orderService.createOrder(orderData);
      setStep(3);
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    await handlePaymentNow();
  };

  if (step === 3) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">{t('order_placed')}</h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {t('order_success_desc')}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                1. {t('shipping')}
              </div>
              <div className="w-8 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                2. {t('payment')}
              </div>
            </div>

            {step === 1 ? (
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{t('shipping_info')}</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('address')}</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('enter_address')}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 min-h-[150px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <button 
                  onClick={() => address ? setStep(2) : toast.error('Address required')}
                  className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3"
                >
                  {t('continue_to_payment')}
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                    <CreditCard size={24} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{t('payment_method')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'credit_card', name: 'Credit Card', icon: <CreditCard size={20} /> },
                    { id: 'bank_transfer', name: 'Bank Transfer', icon: <ShieldCheck size={20} /> },
                  ].map((m) => {
                    const saved = savedMethods.find(s => s.type === m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMethod(m.id)}
                        className={`flex items-center gap-4 p-6 rounded-2xl border transition-all ${paymentMethod === m.id ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-500/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className={`p-2 rounded-lg ${paymentMethod === m.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {m.icon}
                        </div>
                        <div className="text-left">
                          <span className="font-black text-sm uppercase tracking-wider block">{m.name}</span>
                          {saved && (
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-none">
                              Saved Information
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('card_holder')}</label>
                        <input 
                          type="text"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})}
                          placeholder="NGUYEN VAN A"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('card_number')}</label>
                        <input 
                          type="text"
                          value={cardInfo.number}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                            if (val.length <= 19) setCardInfo({...cardInfo, number: val});
                          }}
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm tracking-widest"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('expiry')}</label>
                          <input 
                            type="text"
                            value={cardInfo.expiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                              if (val.length <= 5) setCardInfo({...cardInfo, expiry: val});
                            }}
                            placeholder="MM/YY"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVC</label>
                          <input 
                            type="password"
                            value={cardInfo.cvc}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              if (val.length <= 3) setCardInfo({...cardInfo, cvc: val});
                            }}
                            placeholder="***"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600 shrink-0">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-sm uppercase tracking-tight text-indigo-900">{t('bank_details')}</h4>
                        <p className="text-[10px] text-indigo-600/70 font-bold uppercase tracking-widest leading-relaxed">
                          Please transfer the exact amount after placing the order.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 p-4 bg-white/50 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank</span>
                        <span className="text-xs font-black uppercase">Vietcombank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</span>
                        <span className="text-xs font-black uppercase">1234567890</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</span>
                        <span className="text-xs font-black uppercase">TIINPOD STORE</span>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handlePaymentNow}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <ShieldCheck size={20} />
                      {t('pay_now')} ({formatCurrency(total, currentLang.startsWith('en') ? 'USD' : 'VND')})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-lg font-black tracking-tight uppercase italic">{t('summary')}</h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate uppercase tracking-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-indigo-600 text-sm">{formatCurrency(item.price * item.quantity, item.currency, item.exchangeRate)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-6">
                  <div className="relative group">
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={t('discount_code')}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full pl-12 pr-28 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-xs"
                    />
                    <button 
                      onClick={handleApplyDiscount}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                    >
                      {t('apply')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{t('subtotal')}</span>
                      <span>{formatCurrency(subtotal, currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-xs font-bold text-emerald-500 uppercase tracking-widest">
                        <span>{t('discount')}</span>
                        <span>-{formatCurrency(appliedDiscount, currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{t('tax')} (10%)</span>
                      <span>{formatCurrency(tax, currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>{t('shipping')}</span>
                      <span>{shipping === 0 ? t('free') : formatCurrency(shipping, currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                      <span className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{t('total')}</span>
                      <span className="text-3xl font-black text-indigo-600 tracking-tighter">{formatCurrency(total, currentLang.startsWith('en') ? 'USD' : 'VND')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest leading-normal"> Secure transaction protected by Tiinpod encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
