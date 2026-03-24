import React, { memo } from 'react';
import { Upload, Plus, Type, RotateCw, Maximize2 } from 'lucide-react';
import { DesignElement } from './types';

interface ToolSidebarProps {
  activeTab: 'design' | 'text' | 'layers' | 'settings';
  setActiveTab: (tab: any) => void;
  elements: DesignElement[];
  selectedId: string | null;
  uploadedGallery: string[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddElement: (type: 'image' | 'text', data?: any) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>, skipHistory?: boolean) => void;
  onSaveHistory: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = memo((props) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {props.activeTab === 'design' && (
        <div className="space-y-6">
          <div 
            onClick={() => props.fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group/upload"
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
              <Upload size={20} className="text-gray-400 group-hover/upload:text-indigo-600" />
            </div>
            <div className="text-center">
              <p className="font-black text-gray-900 text-xs">Upload New Image</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">PNG, JPG up to 10MB</p>
            </div>
            <input ref={props.fileInputRef} type="file" className="hidden" onChange={props.onFileUpload} accept="image/*" />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              Your Gallery
              <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">{props.uploadedGallery.length}</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {props.uploadedGallery.map((url, i) => (
                <div 
                  key={i} 
                  onClick={() => props.onAddElement('image', { url })}
                  className="aspect-square bg-white rounded-2xl border border-gray-100 p-2 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:shadow-xl hover:shadow-indigo-100/30 transition-all group"
                >
                  <img src={url} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="gallery" />
                </div>
              ))}
            </div>
            {props.uploadedGallery.length === 0 && (
              <div className="text-center py-12 text-gray-400 opacity-50 px-6">
                 <p className="text-[10px] font-black uppercase tracking-widest">Your gallery is empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {props.activeTab === 'text' && (
        <div className="space-y-6">
          <button 
            onClick={() => props.onAddElement('text')}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} /> ADD NEW TEXT
          </button>
          
          <div className="grid grid-cols-1 gap-4 pt-6">
             <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Text Presets</h3>
             {['Heading', 'Subheading', 'Body', 'Signature'].map(type => (
                <button 
                  key={type}
                  onClick={() => props.onAddElement('text', { text: type })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-left hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                >
                   <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{type} Asset</span>
                </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
});
