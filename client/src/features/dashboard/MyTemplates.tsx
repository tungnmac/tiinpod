import React, { useEffect, useState, useMemo } from 'react';
import { Layout, Search, Filter, Plus, Edit2, Trash2, ExternalLink, Calendar, Package } from 'lucide-react';
import { savedTemplateService, UserTemplate } from '../../services/savedTemplateService';
import UpdateUserTemplateModal from './components/UpdateUserTemplateModal';

const MyTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await savedTemplateService.getMyTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await savedTemplateService.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      alert('Failed to delete template');
    }
  };

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter(t => (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [templates, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Layout size={24} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Workspace</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Templates</h1>
          <p className="text-gray-500 font-medium">Manage and edit your saved product designs</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search designs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl w-full md:w-72 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-gray-700 shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:text-indigo-600 hover:border-indigo-100 transition-all hover:bg-indigo-50/50 shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={`skeleton-${i}`} className="bg-white rounded-[2rem] h-96 border border-gray-100 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
            <Plus size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 font-medium max-w-xs mb-8">
            {searchTerm ? `No results for "${searchTerm}"` : "You haven't saved any designs yet. Start by creating your first product mockup!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => {
            return (
            <div 
              key={template.id}
              className="group bg-white rounded-3xl border-2 border-transparent hover:border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(79,70,229,0.1)] transition-all duration-500 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template);
                setIsEditModalOpen(true);
              }}
            >
              {/* Card Preview */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  src={template.preview_image_url || '/placeholder.png'} 
                  alt={template.name || 'Design'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                  >
                    <Edit2 size={16} /> Edit Design
                  </button>
                </div>
                
                {/* Badge for Product Type */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <Package size={14} className="text-indigo-600" />
                  <span className="text-[11px] font-bold text-gray-700">{template.product_template?.name || 'Standard Product'}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-gray-900 line-clamp-1 leading-tight">{template.name || 'Unnamed Design'}</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={12} />
                      <span className="text-[11px] font-bold">{template.created_at ? new Date(template.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(template.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Modal for updating user template */}
      <UpdateUserTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTemplate(null);
        }}
        userTemplate={selectedTemplate as any}
        onSuccess={fetchTemplates}
      />
    </div>
  );
};

export default MyTemplates;
