import React from 'react';
import { 
  Leaf, Info, ArrowRight, ShieldCheck, Heart, 
  Play, Youtube, Instagram, Star, Quote, MessageSquare 
} from 'lucide-react';
import Slider from '../../../components/common/Slider';

const SpecialtyTea = () => {
  const reviews = [
    { name: 'Satoshi Nakamoto', date: '2 days ago', content: 'The Da Hong Pao has a profile I have never experienced anywhere else. Truly elite.', rating: 5 },
    { name: 'Sarah Miller', date: '1 week ago', content: 'The packaging itself is a work of art. The tea inside? Perfection.', rating: 5 }
  ];

  const relatedProducts = [
    { name: 'Ceramic Gaiwan', category: 'Teaware', img: 'https://images.unsplash.com/photo-1576091160550-2173bdd99975?q=80&w=400' },
    { name: 'Bamboo Tray', category: 'Tools', img: 'https://images.unsplash.com/photo-1544739313-6fad02872377?q=80&w=400' },
    { name: 'Glass Pitcher', category: 'Vessel', img: 'https://images.unsplash.com/photo-1594631252845-29fc45865157?q=80&w=400' },
    { name: 'Tea Tongs', category: 'Utility', img: 'https://images.unsplash.com/photo-1563911191333-047bb9f1011c?q=80&w=400' }
  ];

  const teas = [
    { title: 'Oolong Imperial', price: '45.00', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800' },
    { title: 'Silver Needle White', price: '68.00', image: 'https://images.unsplash.com/photo-1594631252845-29fc458681b3?q=80&w=800' },
    { title: 'Jasmine Pearls', price: '32.00', image: 'https://images.unsplash.com/photo-1563911191295-63d113959344?q=80&w=800' },
  ];

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Slider Section */}
      <div className="relative h-[85vh] bg-emerald-950 overflow-hidden">
        <Slider 
          autoPlay={true}
          interval={5000}
          className="h-full w-full"
          items={[
            <div className="relative h-full w-full flex items-center justify-center bg-emerald-950">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1544256619-383c389c8369?q=80&w=2000" className="w-full h-full object-cover scale-110" alt="Specialty Tea Slide 1" />
                <div className="absolute inset-0 bg-emerald-950/40"></div>
              </div>
              <div className="relative z-10 max-w-7xl mx-auto px-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-10">
                    <Leaf size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Spring Selection</span>
                </div>
                <h1 className="text-6xl md:text-9xl font-black text-white uppercase italic leading-[0.85] tracking-tighter mb-10">Specialty<br/>Tea Sourcing</h1>
                <p className="text-xl md:text-2xl text-emerald-100/70 font-medium max-w-xl leading-relaxed mb-12">Hand-picked leaves from the mystical peaks of Wuyi Mountains. Pure, digital-verified heritage.</p>
                <button className="px-12 py-5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all hover:shadow-2xl">Explore Collection</button>
              </div>
            </div>,
            <div className="relative h-full w-full flex items-center justify-center bg-emerald-950">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1563911191333-32802f0580a8?q=80&w=2000" className="w-full h-full object-cover" alt="Specialty Tea Slide 2" />
                <div className="absolute inset-0 bg-emerald-950/40"></div>
              </div>
              <div className="relative z-10 max-w-4xl mx-auto px-10">
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-8">Master's Batch</h2>
                <p className="text-xl text-stone-300 mb-10">Strictly limited harvests, processed by artisan brewers under ideal solar alignments.</p>
                <button className="px-10 py-4 border border-white/20 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-stone-900 transition-all">Check Availability</button>
              </div>
            </div>,
            <div className="relative h-full w-full flex items-center justify-center bg-emerald-950">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1576092729250-19c13731488a?q=80&w=2000" className="w-full h-full object-cover" alt="Specialty Tea Slide 3" />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="relative z-10 max-w-4xl mx-auto px-10 text-right">
                <h2 className="text-5xl md:text-8xl font-black text-emerald-400 uppercase italic tracking-tighter mb-8 leading-[0.9]">Ancient<br/>Terroir</h2>
                <p className="text-xl text-emerald-100/60 mb-10 ml-auto max-w-lg">Every batch linked to GPS coordinates and real-time mountain climate data.</p>
                <button className="px-12 py-5 bg-white text-emerald-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">Provenance Map</button>
              </div>
            </div>
          ]}
        />
      </div>

      {/* Info Section */}
      <div className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-24">
          {[
            { icon: ShieldCheck, title: 'DNA Verified', desc: 'Every leaf is genetically sequenced for authenticity.' },
            { icon: Info, title: 'Terroir Tracking', desc: 'Real-time soil and altitude data for every batch.' },
            { icon: Heart, title: 'Ethical Direct', desc: 'Fair compensation for mountain harvesters.' }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                <item.icon size={32} className="text-emerald-700" />
              </div>
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest mb-6 italic">{item.title}</h3>
              <p className="text-base text-emerald-800/60 font-medium leading-loose">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Content Section */}
      <div className="bg-stone-50 py-40 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative aspect-square rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] bg-white">
            <img src="https://images.unsplash.com/photo-1517404283307-27b592657e2d?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Tea Harvesting Video" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 cursor-pointer hover:scale-110 transition-all">
                <Play size={32} className="text-white fill-white ml-2" />
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.5em] mb-6 block">Process</span>
            <h2 className="text-5xl font-black text-emerald-950 uppercase italic mb-10 leading-tight">From Mountain<br/>To Your TiinPod</h2>
            <p className="text-lg text-emerald-800/70 font-medium leading-[1.8] mb-12">Watch our journey through the mist-covered peaks of Fujian, where every leaf is selected by hand according to ancient seasonal calendars.</p>
            <div className="flex gap-6">
               <a href="#" className="flex items-center gap-4 px-8 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-100">
                 <Youtube size={18} /> Subscribe
               </a>
               <a href="#" className="flex items-center gap-4 px-8 py-5 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-stone-100">
                 <Instagram size={18} /> Heritage
               </a>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-end justify-between mb-24">
            <div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.5em] mb-6 block">Community</span>
              <h3 className="text-6xl font-black text-emerald-950 uppercase italic tracking-tighter">Feedback</h3>
            </div>
            <div className="hidden md:flex items-center gap-4 py-6 px-10 bg-emerald-50 rounded-3xl border border-emerald-100">
              <MessageSquare size={18} className="text-emerald-700" /> 
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">124 Reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {reviews.map((r, i) => (
              <div key={i} className="p-12 bg-emerald-50/20 rounded-[4rem] border border-emerald-50 hover:bg-emerald-50 transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-base font-black text-emerald-950 uppercase tracking-tight">{r.name}</h4>
                    <p className="text-[10px] text-emerald-700/50 font-black uppercase tracking-widest mt-1 italic">{r.date}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} className="fill-emerald-600 text-emerald-600" />)}
                  </div>
                </div>
                <p className="text-emerald-900/70 text-lg font-medium leading-[1.8] italic">"{r.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="py-40 bg-emerald-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-10">
           <h3 className="text-4xl font-black uppercase italic mb-20 px-4">Brew with Precision</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 px-4">
             {relatedProducts.map((p, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] rounded-[3rem] overflow-hidden mb-8 border border-white/5 shadow-2xl bg-white/5">
                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" alt={p.name} />
                  </div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 italic">{p.category}</p>
                  <h4 className="text-lg font-black uppercase group-hover:text-emerald-400 transition-colors tracking-tight">{p.name}</h4>
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* Tea Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teas.map((tea, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-6 shadow-xl transition-all group-hover:shadow-2xl group-hover:-translate-y-2">
                <img src={tea.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={tea.title} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{tea.title}</h3>
              <p className="text-indigo-600 font-bold mb-4">${tea.price}</p>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 transition-colors">
                Explore Blend <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialtyTea;
