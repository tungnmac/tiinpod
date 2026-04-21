import React from 'react';
import { ShoppingBag, ArrowRight, UserCheck, Scissors, Ruler, 
  Shirt, Palette, Zap, Globe, Heart, ShieldCheck, 
  Play, Youtube, Instagram, Twitter, MessageSquare, Star, Quote, ChevronRight, ShoppingCart 
} from 'lucide-react';
import Slider from '../../../components/common/Slider';
import { useCartStore } from '../../../store/useCartStore';
import { useCurrency } from '../../../hooks/useCurrency';
import toast from 'react-hot-toast';

const CulturalApparel = () => {
  const { addItem } = useCartStore();
  const { formatCurrency } = useCurrency();

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id, // Chuẩn hóa về number, id phải là số thực tế từ DB
      name: product.name,
      price: parseFloat(product.price || "89.00"),
      currency: 'USD',
      image: product.image || product.img,
      quantity: 1
    });
    
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#78350f',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '10px'
      },
      icon: '🥋'
    });

    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const apparelItems = [
    { id: 109, name: 'Zen Monk Robe', price: '129.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800' },
    { id: 110, name: 'Minimalist Kimono', price: '189.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800' },
    { id: 111, name: 'Heritage Silk Shirt', price: '155.00', currency: 'USD', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=800' },
  ];

  const clientReviews = [
    { name: 'Arthur L.', rating: 5, content: 'The material quality is beyond anything I have seen from a startup. Exceptional craft.' },
    { name: 'Kaito T.', rating: 5, content: 'Worn it at a ceremony, everyone asked about TiinPod. The design is timeless.' }
  ];

  const ensembleItems = [
    { name: 'Ceramic Tea Kit', category: 'Accessories', img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=400' },
    { name: 'Silk Pocket Square', category: 'Detail', img: 'https://images.unsplash.com/photo-1514813482567-2858e6c00ee1?q=80&w=400' },
    { name: 'Linen Scarf', category: 'Apparel', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=400' },
    { name: 'Meditation Zen', category: 'Incense', img: 'https://images.unsplash.com/photo-1602847280244-644788f4078a?q=80&w=400' }
  ];

  const lookbookVideos = [
    // ...existing code...
    { title: 'The Zen of Silk', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200' },
    { title: 'Modern Heritage', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200' }
  ];

  return (
    <div className="animate-in fade-in duration-1000 bg-stone-50">
      {/* Featured Items Grid */}
      <div className="py-24 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em] mb-4 block">New Arrivals</span>
              <h2 className="text-6xl font-black text-stone-900 uppercase italic tracking-tighter">Garment Archive</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {apparelItems.map((item, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/6] overflow-hidden rounded-[3rem] mb-10 shadow-2xl relative bg-stone-200">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-12">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-5 bg-white text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center justify-center gap-3"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start px-4">
                  <div>
                    <h3 className="text-xl font-black text-stone-900 uppercase italic tracking-tight mb-2">{item.name}</h3>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic">Spring 2026</p>
                  </div>
                  <p className="text-2xl font-black text-stone-700">{formatCurrency(parseFloat(item.price), item.currency || 'USD')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Section - Lookbook Video */}
      <div className="py-48 bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
            <div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.5em] mb-6 block">Lookbook 2026</span>
              <h2 className="text-5xl font-black text-stone-900 uppercase italic tracking-tighter">Digital Tradition<br/>In Motion</h2>
            </div>
            <div className="flex gap-6 mt-10 lg:mt-0">
               <a href="#" className="flex items-center gap-4 px-8 py-5 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-stone-200 transition-all"><Youtube size={18} /> Lookbook</a>
               <a href="#" className="flex items-center gap-4 px-8 py-5 bg-stone-200 text-stone-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-300 transition-all"><Instagram size={18} /> Reels</a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-4">
            {lookbookVideos.map((l, i) => (
              <div key={i} className="group relative aspect-[16/10] bg-stone-200 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] cursor-pointer">
                <img src={l.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center group-hover:bg-black/10 transition-all">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 scale-75 group-hover:scale-100 transition-all duration-500">
                    <Play size={32} className="text-white fill-white ml-2" />
                  </div>
                  <p className="mt-8 text-white font-black uppercase tracking-[0.4em] text-[10px] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">{l.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="py-48 bg-white">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
           <div className="lg:col-span-1 p-16 bg-amber-50 rounded-[4rem] border border-amber-100 flex flex-col justify-center">
              <h3 className="text-3xl font-black text-amber-950 uppercase italic mb-10 leading-tight">Voices of the<br/>Community</h3>
              <div className="flex items-center gap-3 mb-6">
                 <div className="flex gap-1"> {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-600 text-amber-600" />)} </div>
              </div>
              <p className="text-lg font-medium text-amber-900/70 leading-[1.8]">"TiinPod clothing represents the next evolution of cultural expression. Every piece tells its own story."</p>
           </div>
           {clientReviews.map((r, i) => (
             <div key={i} className="lg:col-span-1 p-16 bg-stone-50 rounded-[4rem] border border-stone-100 flex flex-col justify-center hover:bg-stone-100/50 transition-colors">
                <div className="flex gap-1 mb-10"> {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} className="fill-stone-400 text-stone-400" />)} </div>
                <p className="text-lg font-medium text-stone-600 leading-[1.8] mb-14 italic">"{r.content}"</p>
                <div className="flex items-center gap-6 border-t border-stone-200 pt-10 mt-auto">
                   <div className="w-14 h-14 bg-stone-200 rounded-2xl flex items-center justify-center font-black text-sm text-stone-600">{r.name[0]}</div>
                   <div>
                      <h4 className="text-xs font-black text-stone-950 uppercase tracking-widest">{r.name}</h4>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">Verified Master</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Suggested Essentials */}
      <div className="py-48 bg-stone-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-10">
           <div className="flex items-end justify-between mb-24 px-4">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-6 block">Curated</span>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Complete the Look</h3>
              </div>
              <span className="hidden md:block text-[10px] text-stone-500 font-bold tracking-[0.3em] uppercase border border-white/10 px-6 py-3 rounded-full italic">Member Exclusive Selection</span>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 px-4">
             {ensembleItems.map((p, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] rounded-[3rem] overflow-hidden mb-8 border border-white/5 shadow-2xl bg-white/5">
                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" alt={p.name} />
                  </div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 italic">{p.category}</p>
                  <h4 className="text-lg font-black uppercase group-hover:text-amber-500 transition-colors tracking-tight">{p.name}</h4>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalApparel;
