import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../hooks/useCurrency';
import api from '../../services/api';
import { 
  ChevronLeft, 
  Box, 
  Edit2, 
  Tag, 
  Truck, 
  Layers, 
  DollarSign, 
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
  provider: string;
  variants: number;
  basePrice: number;
  description: string;
  status: string;
  specs: { label: string; value: string; }[];
  features: string[];
  image_url: string;
}

const BaseTemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const [template, setTemplate] = useState<ProductTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/product-templates/${id}`);
        setTemplate(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch template details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!template) {
    return <div className="p-8">Template not found.</div>;
  }


  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/templates')}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 group"
          >
            <ChevronLeft size={24} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Box size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('master_data')}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{template.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/templates/${id}/edit`)}
            className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Edit2 size={18} />
            <span>{t('edit')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals & Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t('media')}</h2>
            </div>
            
            <div className="aspect-[16/9] rounded-3xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center group overflow-hidden relative">
              <img 
                src={template.image_url || "https://via.placeholder.com/800x450"} 
                alt="Template Preview" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-6 right-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold shadow-xl border border-white/20">
                  {template.type} Perspective
                </span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <h3 className="font-bold text-gray-900">{t('description')}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {template.description}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Technical Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {template.specs?.map((spec, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{spec.label}</span>
                  <span className="font-bold text-gray-700">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="font-bold text-gray-900">Key Features</h3>
              <div className="flex flex-wrap gap-3">
                {template.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-indigo-50/50 text-indigo-600 rounded-xl font-bold text-sm">
                    <CheckCircle2 size={16} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Stats */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('general_info')}</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('category')}</p>
                  <p className="font-bold text-gray-900">{template.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('provider')}</p>
                  <p className="font-bold text-gray-900">{template.provider}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('base_price')}</p>
                  <p className="font-black text-indigo-600 text-lg">{formatCurrency(template.basePrice)}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-400">{t('status')}</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  {template.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">{t('variants')}</span>
                <span className="font-black text-gray-900">{template.variants}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-bold mb-4">Start Designing</h3>
            <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
              Use this base template to create a new design for your store.
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10">
              Open 3D Editor
            </button>
            <button className="w-full mt-4 py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-wider text-xs border border-indigo-400/30 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <ExternalLink size={16} />
              View on Vendor Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTemplateDetail;
