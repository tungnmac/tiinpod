import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Play, CheckCircle2, Globe, Zap, Users, ShieldCheck, 
  Youtube, Instagram, Twitter, MessageSquare, Star, Quote, ChevronRight
} from 'lucide-react';
import Slider from '../../../components/common/Slider';

const HomeIntro = () => {
  const navigate = useNavigate();

  const testimonials = [
    { name: 'Arthur Chen', role: 'Master Brewer', content: 'TiinPod has completely transformed how I visualize my seasonal tea collections. The 3D space is unmatched.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Elena Rodriguez', role: 'Connoisseur', content: 'Digital tradition is a paradox that TiinPod solved beautifully. Excellent sourcing and technology.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Kaito Tanaka', role: 'Designer', content: 'The layer precision in the design orchestrator is better than professional software. My brand owes it all to TiinPod.', rating: 5, avatar: 'https://i.pravatar.cc/150?u=3' }
  ];

  const socialLinks = [
    { icon: Youtube, label: 'Masters Series', color: 'hover:text-red-600', path: 'https://youtube.com' },
    { icon: Instagram, label: 'Heritage Visuals', color: 'hover:text-pink-600', path: 'https://instagram.com' },
    { icon: Twitter, label: 'TiinPod Updates', color: 'hover:text-sky-500', path: 'https://twitter.com' }
  ];

  return (
    <div className="pt-20 animate-in fade-in duration-700 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[90vh] bg-white overflow-hidden">
        <Slider 
          autoPlay={true}
          interval={6000}
          className="h-full w-full"
          items={[
            <div className="relative h-full w-full flex items-center justify-center bg-gray-900">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2000" className="w-full h-full object-cover scale-110" alt="Slide 1" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              <div className="relative z-10 text-center px-10 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Digital Heritage 2026</span>
                </div>
                <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase italic mb-10">
                  Tiin<span className="text-indigo-500">Pod</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium text-white/70 mb-14 max-w-2xl mx-auto leading-relaxed">
                  The world's first <span className="text-white font-bold">Design Orchestrator</span> for modern tea culture.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <button onClick={() => navigate('/templates')} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl">
                    Enter Workspace <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>,
            <div className="relative h-full w-full flex items-center justify-center bg-indigo-950">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1582718394035-af1f9655e907?q=80&w=2000" className="w-full h-full object-cover scale-110" alt="Slide 2" />
                <div className="absolute inset-0 bg-indigo-950/40"></div>
              </div>
              <div className="relative z-10 text-center px-10 max-w-5xl mx-auto">
                <h2 className="text-5xl md:text-8xl font-black text-white leading-[1] tracking-tighter uppercase italic mb-10">
                  Precision <span className="text-indigo-400">Craft</span>
                </h2>
                <p className="text-xl md:text-2xl font-medium text-indigo-100/70 mb-14 max-w-2xl mx-auto leading-relaxed">
                  Every pod represents 1,000 years of tradition, refined by AI engineering.
                </p>
                 <button onClick={() => navigate('/home/tea')} className="px-10 py-5 bg-white text-indigo-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all">
                  Sourcing Map
                 </button>
              </div>
            </div>,
            <div className="relative h-full w-full flex items-center justify-center bg-stone-900">
              <div className="absolute inset-0 z-0 h-full w-full">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" className="w-full h-full object-cover scale-110" alt="Slide 3" />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              <div className="relative z-10 text-center px-10 max-w-5xl mx-auto">
                <h2 className="text-5xl md:text-8xl font-black text-white leading-[1] tracking-tighter uppercase italic mb-10">
                  Global <span className="text-amber-500">Atelier</span>
                </h2>
                <p className="text-xl md:text-2xl font-medium text-stone-300 mb-14 max-w-2xl mx-auto leading-relaxed">
                  Connecting master harvesters with the next generation of designers worldwide.
                </p>
                 <button onClick={() => navigate('/home/apparel')} className="px-10 py-5 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all">
                  Explore Apparel
                 </button>
              </div>
            </div>
          ]}
        />
      </div>

      {/* Mission Section */}
      <div className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em] mb-6 block">Our Mission</span>
              <h2 className="text-5xl font-black text-gray-900 leading-tight uppercase italic mb-10">Crafting the<br/>Digital Zen</h2>
              <p className="text-lg text-gray-600 leading-loose mb-12 font-medium">
                We believe that tradition shouldn't be static. TiinPod merges the ancient soul of tea ceremonies with the precision of 3D generative design.
              </p>
              
              <div className="grid grid-cols-2 gap-10">
                {[
                  { icon: Globe, title: 'Global Sourcing', desc: 'Direct from the source' },
                  { icon: Zap, title: 'AI Orchestrator', desc: 'Next-gen design tools' },
                  { icon: Users, title: 'Community', desc: 'Collective of masters' },
                  { icon: ShieldCheck, title: 'Authenticity', desc: 'Blockchain verified' }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors border border-gray-100">
                      <item.icon size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
                <img src="https://images.unsplash.com/photo-1576091160550-2173bdd99975?q=80&w=1000" className="w-full h-full object-cover" alt="Product Showcase" />
              </div>
              <div className="absolute -bottom-16 -left-16 p-12 bg-white rounded-[3rem] shadow-2xl border border-gray-50 hidden lg:block">
                <CheckCircle2 size={40} className="text-indigo-600 mb-6" />
                <p className="text-2xl font-black text-gray-900 uppercase italic">Quality<br/>Ensured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video & Experience Section */}
      <div className="py-40 bg-gray-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white italic uppercase mb-6 tracking-tighter">Behind the Essence</h2>
            <p className="text-gray-500 font-bold tracking-[0.4em] text-[10px] uppercase">A sensory journey through TiinPod heritage</p>
          </div>
          
          <div className="relative aspect-video rounded-[4rem] overflow-hidden border border-white/10 group cursor-pointer shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)]">
            <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2000" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" alt="Video Preview" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
              <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all">
                <Play size={36} className="text-white fill-white ml-2" />
              </div>
              <p className="mt-10 text-white font-black uppercase tracking-[0.5em] text-[10px]">Play Brand Film</p>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
            {socialLinks.map((social, i) => (
              <a key={i} title={social.label} href={social.path} target="_blank" rel="noreferrer" className={`flex items-center justify-between p-10 bg-white/5 border border-white/10 rounded-[2.5rem] group transition-all hover:bg-white/10 ${social.color}`}>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <social.icon size={26} className="text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-widest">{social.label}</span>
                </div>
                <ChevronRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-40 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="text-left">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em] mb-6 block">Feedback</span>
              <h2 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Voice of<br/>The Masters</h2>
            </div>
            <div className="flex items-center gap-6 py-6 px-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
               <div className="flex gap-1"> {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)} </div>
               <span className="text-xs font-black text-gray-900 uppercase tracking-widest">4.9/5 Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative group">
                <Quote className="absolute top-10 right-10 text-indigo-50 group-hover:text-indigo-100 transition-colors" size={80} />
                <div className="relative">
                  <div className="flex gap-1 mb-8">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-gray-600 font-medium leading-[1.8] mb-12 italic text-lg">"{t.content}"</p>
                  <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                    <img src={t.avatar} className="w-14 h-14 rounded-2xl bg-gray-100 grayscale hover:grayscale-0 transition-all" alt={t.name} />
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{t.name}</h4>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16 px-4">
             <h3 className="text-2xl font-black text-gray-900 uppercase italic">Seasonal Essentials</h3>
             <button onClick={() => navigate('/templates')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
               View All <ArrowRight size={14} />
             </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Oolong Kit', category: 'Starter', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=400' },
              { name: 'Zen Mask', category: 'Apparel', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400' },
              { name: 'Master Kettle', category: 'Teaware', image: 'https://images.unsplash.com/photo-1576091160550-2173bdd99975?q=80&w=400' },
              { name: 'Sourcing 3D', category: 'Exclusive', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400' }
            ].map((p, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-lg transition-all">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                </div>
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{p.category}</p>
                <h4 className="text-sm font-black text-gray-900 uppercase group-hover:text-indigo-600 transition-colors">{p.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
           <ShieldCheck size={48} className="mx-auto text-indigo-600" />
           <h3 className="text-3xl font-black text-gray-900 uppercase italic">Join the TiinPod Evolution</h3>
           <p className="text-gray-500 font-medium leading-relaxed">Whether you are a master seeking the finest teaware or a designer building a digital brand, TiinPod provides the tools of the future.</p>
           <button 
            onClick={() => navigate('/login')}
            className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all hover:shadow-2xl active:scale-95"
           >
              Create Account
           </button>
        </div>
      </div>
    </div>
  );
};

export default HomeIntro;
