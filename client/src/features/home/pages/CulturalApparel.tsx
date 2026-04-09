import React from 'react';
import { ShoppingBag, ArrowRight, UserCheck, Scissors, Ruler, 
  Shirt, Palette, Zap, Globe, Heart, ShieldCheck, 
  Play, Youtube, Instagram, Twitter, MessageSquare, Star, Quote, ChevronRight 
} from 'lucide-react';
import Slider from '../../../components/common/Slider';

const CulturalApparel = () => {
  const lookbookVideos = [
    { title: 'The Zen of Silk', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200' },
    { title: 'Modern Heritage', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200' }
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

  return (
    <div className="pt-20 animate-in fade-in duration-1000 bg-stone-50">
      {/* Hero Slider Section */}
      <div className="relative h-[85vh] bg-stone-900 overflow-hidden">
        <Slider 
          autoPlay={true}
          interval={5500}
          className="h-full w-full"
          items={[
            <div className="relative h-full w-full flex items-center justify-center bg-stone-950">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000" className="w-full h-full object-cover scale-110" alt="Apparel Slide 1" />
                <div className="absolute inset-0 bg-stone-900/40"></div>
              </div>
              <div className="relative z-10 max-w-7xl mx-auto px-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-10">
                    <Shirt size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Spring Collection</span>
                </div>
                <h1 className="text-7xl md:text-[10rem] font-black text-white uppercase italic leading-[0.8] tracking-tighter mb-10">Cultural<br/>Apparel</h1>
                <p className="text-xl md:text-2xl text-stone-400 font-medium max-w-2xl leading-relaxed mb-14">Wearable tradition. Blending heritage silks with modern silhouettes.</p>
                <button className="px-14 py-6 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all hover:shadow-[0_20px_40px_-10px_rgba(217,119,6,0.5)]">Shop the Look</button>
              </div>
            </div>,
            <div className="relative h-full w-full flex items-center justify-center bg-stone-900">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2000" className="w-full h-full object-cover" alt="Apparel Slide 2" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="relative z-10 max-w-4xl mx-auto px-10 text-right">
                <h2 className="text-6xl md:text-9xl font-black text-amber-500 uppercase italic tracking-tighter mb-8 leading-[0.9]">Zen<br/>Streetwear</h2>
                <p className="text-xl text-stone-300 mb-10 ml-auto max-w-lg">Minimalist designs for the modern urban wanderer, inspired by monk aesthetics.</p>
                <button className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-all">View Lookbook</button>
              </div>
            </div>,
            <div className="relative h-full w-full flex items-center justify-center bg-stone-950">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000" className="w-full h-full object-cover" alt="Apparel Slide 3" />
                <div className="absolute inset-0 bg-stone-950/50"></div>
              </div>
              <div className="relative z-10 max-w-5xl mx-auto px-10">
                <h2 className="text-6xl md:text-[8rem] font-black text-white uppercase italic tracking-tighter mb-10 leading-[0.85]">Silk &<br/>Design</h2>
                <p className="text-xl text-amber-100/70 mb-14 mx-auto max-w-2xl">Traditional Souchong silk meets 3D structural generative modeling.</p>
                <button className="px-12 py-5 bg-white text-amber-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-all">Material Archives</button>
              </div>
            </div>
          ]}
        />
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
