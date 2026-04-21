import React from 'react';
import { 
  Leaf, Info, ArrowRight, ShieldCheck, Heart, 
  Play, Youtube, Instagram, Star, Quote, MessageSquare, ShoppingCart 
} from 'lucide-react';
import Slider from '../../../components/common/Slider';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrency } from '../../../hooks/useCurrency';
import toast from 'react-hot-toast';

const SpecialtyTea = () => {
  const { addItem } = useCartStore();
  const { formatCurrency } = useCurrency();

  const teas = [
    { id: 106, title: 'Oolong Imperial', price: '45.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800' },
    { id: 107, title: 'Silver Needle White', price: '68.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1594631252845-29fc458681b3?q=80&w=800' },
    { id: 108, title: 'Jasmine Pearls', price: '32.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1563911191295-63d113959344?q=80&w=800' },
  ];

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id, // Chuẩn hóa về number, id phải là số thực tế từ DB
      name: product.title,
      price: parseFloat(product.price),
      currency: 'USD',
      image: product.image,
      quantity: 1
    });
    
    toast.success(`${product.title} added to cart!`, {
      style: {
        background: '#064e3b',
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '10px',
        letterSpacing: '0.1em'
      },
      icon: '🍃'
    });

    // Dispatch event to open cart
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  return (
    <div className="animate-in fade-in duration-1000">
      {/* ...existing code... */}
      <div className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.5em] mb-6 block">Curated Selection</span>
              <h2 className="text-6xl font-black text-emerald-950 uppercase italic tracking-tighter">Tea Archives</h2>
            </div>
            <p className="text-lg text-emerald-800/60 font-medium max-w-md leading-relaxed">Direct-from-source harvests, vacuum-sealed at the peak of flavor profile.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {teas.map((tea, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-[3.5rem] mb-10 shadow-2xl transition-all group-hover:shadow-emerald-200/50 group-hover:-translate-y-4 relative bg-emerald-100">
                  <img src={tea.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={tea.title} />
                  <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button 
                      onClick={() => handleAddToCart(tea)}
                      className="w-full py-5 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-950 hover:bg-white transition-all shadow-xl"
                    >
                      <ShoppingCart size={16} /> Quick Add
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start px-4">
                  <div>
                    <h3 className="text-xl font-black text-emerald-950 uppercase italic tracking-tight mb-2">{tea.title}</h3>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Spring 2024 Harvest</p>
                  </div>
                  <p className="text-2xl font-black text-emerald-900">{formatCurrency(parseFloat(tea.price), tea.currency || 'USD')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialtyTea;
