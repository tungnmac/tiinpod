import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Coffee, Shirt, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

const ContentHub = () => {
  const navigate = useNavigate();

  const hubs = [
    {
      title: 'Specialty Tea',
      desc: 'Discover rare blends from high-altitude estates.',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800',
      path: '/home/tea',
      icon: Leaf,
      color: 'bg-emerald-50 text-emerald-600',
      tag: 'Curation'
    },
    {
      title: 'Brewing Teaware',
      desc: 'Expertly crafted tools for the perfect infusion.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173bdd99975?q=80&w=800',
      path: '/home/teaware',
      icon: Coffee,
      color: 'bg-amber-50 text-amber-600',
      tag: 'Hardware'
    },
    {
      title: 'Cultural Apparel',
      desc: 'Minimalist garments inspired by ancient traditions.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
      path: '/home/apparel',
      icon: Shirt,
      color: 'bg-rose-50 text-rose-600',
      tag: 'Lifestyle'
    },
    {
      title: 'Design Space',
      desc: 'Our most advanced 3D creative orchestrator.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200',
      path: '/home/design',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-600',
      tag: '3D Studio'
    }
  ];

  return (
    <div className="pt-20 pb-20 animate-in fade-in duration-700 max-w-[1600px] mx-auto px-6">
      <div className="mb-16 text-left">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Content<span className="text-indigo-600">Hub</span></h1>
        <p className="text-gray-500 font-medium max-w-xl leading-relaxed uppercase text-xs tracking-widest">
          Explore our specialized sub-worlds. From heritage leaves to cutting-edge 3D design technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {hubs.map((hub, i) => (
          <div 
            key={i} 
            onClick={() => navigate(hub.path)}
            className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 active:scale-[0.98]"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden">
               <img src={hub.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={hub.title} />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
               <div className="absolute top-6 left-6">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-white/20">{hub.tag}</span>
               </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2.5 rounded-xl ${hub.color}`}>
                    <hub.icon size={20} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-xl font-black text-gray-900 leading-tight">{hub.title}</h2>
              </div>
              <p className="text-xs text-gray-500 font-bold leading-loose mb-8 flex-1">
                {hub.desc}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                  Explore Now <ArrowRight size={14} />
                </span>
                <ExternalLink size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </div>
        ))}
      </div>

      {/* Hero Footnote */}
      <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay" />
         <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-4 uppercase italic">Ready to Create Your Own?</h3>
            <p className="text-gray-400 text-sm font-medium mb-8 max-w-lg mx-auto leading-relaxed">Join 12,000+ creators using our specialized assets to build their digital tea empires.</p>
            <button 
              onClick={() => navigate('/templates')}
              className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95"
            >
              Start Designing
            </button>
         </div>
      </div>
    </div>
  );
};

export default ContentHub;
