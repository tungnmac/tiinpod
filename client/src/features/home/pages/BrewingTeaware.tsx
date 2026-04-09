import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Flame, Scale } from 'lucide-react';

const BrewingTeaware = () => {
  const teaware = [
    { title: 'Ceramic Gaiwan', price: '85.00', image: 'https://images.unsplash.com/photo-1576091160550-2173bdd99975?q=80&w=800' },
    { title: 'Bamboo Shusaku Kettle', price: '125.00', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=800' },
    { title: 'Glass Infuser Set', price: '45.00', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=800' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="relative h-[600px] bg-[#1a1a1a] flex items-center justify-center p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto gap-20">
          <div className="flex flex-col justify-center text-white">
            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] mb-4">Craftsmanship</span>
            <h1 className="text-6xl font-black mb-6 leading-tight">Elite Brewing<br/>Teaware</h1>
            <p className="text-gray-400 font-medium mb-10 leading-relaxed max-w-md">Precision-engineered tools for the modern tea connoisseur. Every piece a masterpiece of form and function.</p>
            <div className="flex items-center gap-8">
               <div className="text-center">
                  <Flame size={32} className="mx-auto mb-2 text-indigo-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Heat Retention</p>
               </div>
               <div className="text-center">
                  <Scale size={32} className="mx-auto mb-2 text-indigo-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Balanced Pour</p>
               </div>
               <div className="text-center">
                  <ShieldCheck size={32} className="mx-auto mb-2 text-indigo-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Durable Build</p>
               </div>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl">
            <img src="https://images.unsplash.com/photo-1563911191295-63d113959344?q=80&w=800" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Main Teaware" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-12 uppercase tracking-widest">Seasonal Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teaware.map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group">
              <div className="aspect-square mb-8 overflow-hidden rounded-3xl">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-2">{item.title}</h4>
              <p className="text-indigo-600 font-bold mb-6">${item.price}</p>
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Add to Collection</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrewingTeaware;
