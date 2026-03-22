import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Palette, Store, CloudUpload, CreditCard, ExternalLink } from 'lucide-react';
import SetupStepCard from './components/SetupStepCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Giả lập trạng thái hoàn thành của các bước
  const [completedSteps, setCompletedSteps] = useState<number[]>([0]); 

  const steps = [
    {
      id: 1,
      step: 1,
      title: t('step_1_title'),
      description: t('step_1_desc'),
      icon: Palette,
      path: "/products"
    },
    {
      id: 2,
      step: 2,
      title: t('step_2_title'),
      description: t('step_2_desc'),
      icon: Store,
      path: "/stores"
    },
    {
      id: 3,
      step: 3,
      title: t('step_3_title'),
      description: t('step_3_desc'),
      icon: CloudUpload,
      path: "/products"
    },
    {
      id: 4,
      step: 4,
      title: t('step_4_title'),
      description: t('step_4_desc'),
      icon: CreditCard,
      path: "/billing"
    }
  ];

  const handleStepClick = (stepId: number) => {
    const step = steps.find(s => s.step === stepId);
    if (step) {
      navigate(step.path);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{t('welcome')}</h1>
          <p className="text-gray-600">
            {t('steps_completed', { count: completedSteps.length })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-all hover:shadow-sm">
            {t('view_guide')}
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Setup Progress Blocks - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.step);
          const isPreviousCompleted = index === 0 || completedSteps.includes(steps[index - 1].step);
          const isLocked = !isPreviousCompleted && !isCompleted;
          const status = isCompleted ? 'completed' : (isPreviousCompleted ? 'in-progress' : 'not-started');

          return (
            <SetupStepCard 
              key={step.id}
              step={step.step}
              title={step.title}
              description={step.description}
              icon={step.icon}
              status={status}
              isLocked={isLocked}
              onClick={() => handleStepClick(step.step)}
            />
          );
        })}
      </div>

      {/* Integration Logos Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm overflow-hidden text-center md:text-left">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-center md:justify-start gap-2">
          <Store className="text-indigo-600" size={20} />
          {t('supported_platforms')}
        </h2>
        {/* ... existing platform logos grid ... */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 grayscale opacity-50 hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="https://cdn.worldvectorlogo.com/logos/shopify.svg" alt="Shopify" className="h-8 md:h-10" />
          </div>
          <div className="flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="https://cdn.worldvectorlogo.com/logos/woocommerce.svg" alt="WooCommerce" className="h-8 md:h-10" />
          </div>
          <div className="flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="https://cdn.worldvectorlogo.com/logos/amazon-2.svg" alt="Amazon" className="h-8 md:h-10" />
          </div>
          <div className="flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="https://cdn.worldvectorlogo.com/logos/etsy.svg" alt="Etsy" className="h-8 md:h-10" />
          </div>
          <div className="flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="https://cdn.worldvectorlogo.com/logos/tiktok-logo.svg" alt="TikTok" className="h-8 md:h-10" />
          </div>
          <div className="flex items-center justify-center p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="https://cdn.worldvectorlogo.com/logos/ebay.svg" alt="eBay" className="h-8 md:h-10" />
          </div>
        </div>
      </div>

      {/* Info Sections - Responsive Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('ready_to_scale')}</h2>
            <p className="text-indigo-100 mb-8 max-w-lg leading-relaxed text-sm md:text-base">
              {t('upgrade_desc')}
            </p>
            <button className="w-full sm:w-auto bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/40 hover:-translate-y-1 active:scale-95">
              {t('upgrade_button')}
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10 transform -rotate-12 translate-y-12 transition-transform group-hover:rotate-0 duration-1000">
            <CloudUpload size={400} />
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between items-center text-center">
           <div className="w-full">
            <div className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-bold inline-block mb-3">{t('prepaid_wallet')}</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{t('wallet_balance')}</h3>
            <p className="text-4xl font-black text-indigo-600 tracking-tight">$0.00</p>
           </div>
           <div className="w-full space-y-4 mt-8">
             <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all hover:shadow-lg active:scale-95">
               {t('topup_now')}
             </button>
             <p className="text-[11px] text-gray-400">
               {t('auto_pay_desc')}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;