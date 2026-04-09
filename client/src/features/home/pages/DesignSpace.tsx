import React from 'react';
import { Sparkles, Layout, MousePointer2, Box, Palette, Layers, Globe, Zap, ArrowRight } from 'lucide-react';

const DesignSpace = () => {
  const features = [
    {
      title: '3D Scene Orchestrator',
      desc: 'Drag and drop products into realistic 3D interior environments.',
      icon: Box,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Real-time Raytracing',
      desc: 'Experience dynamic lighting and shadows as you design.',
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Multi-View Layouts',
      desc: 'Seamlessly switch between front, back, and perspective views.',
      icon: Layout,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Layer Precision',
      desc: 'Professional-grade layer management for complex designs.',
      icon: Layers,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    }
  ];

  return (
    <div className="animate-in fade-in duration-700 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900 py-32 px-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]" />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Design Space Background" 
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
            <Sparkles size={14} /> New Creative Horizon
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic">
            Design<br/><span className="text-transparent border-b-4 border-indigo-500 pb-2" style={{ WebkitTextStroke: '2px white' }}>Space</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Step into our most advanced creative environment yet. A professional 3D orchestrator built for those who define the future of tea culture.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30">
              Launch Studio
            </button>
            <button className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
              <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">{f.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-loose mb-6">{f.desc}</p>
              <div className="h-1 w-12 bg-gray-200 group-hover:w-full group-hover:bg-indigo-500 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-[#0a0a0a] text-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black tracking-tight leading-tight uppercase">
              Beyond the<br/>Standard Canvas
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              We've replaced the traditional flat editor with a dynamic spatial system. Every asset, every texture, and every light source is under your total control.
            </p>
            <div className="space-y-4">
              {[
                'Unlimited 4K Export Resolution',
                'Advanced Typography Engine',
                'Integrated Cloudinary Asset Pipeline',
                'One-Click Cart Synchronization'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest opacity-80">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20">
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="3D Interface Preview" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500">
                  <Zap size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSpace;
