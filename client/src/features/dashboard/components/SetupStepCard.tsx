import React from 'react';
import { useTranslation } from 'react-i18next';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface SetupStepCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'not-started' | 'in-progress' | 'completed';
  isLocked?: boolean;
  onClick: () => void;
}

const SetupStepCard: React.FC<SetupStepCardProps> = ({ 
  step, 
  title, 
  description, 
  icon: Icon, 
  status, 
  isLocked = false,
  onClick 
}) => {
  const { t } = useTranslation();
  
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500 ring-opacity-50';
      default:
        return 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md';
    }
  };

  return (
    <div className={`relative p-6 rounded-2xl border transition-all duration-300 ${getStatusStyles()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${status === 'in-progress' ? 'bg-indigo-600 text-white' : (status === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600')}`}>
          <Icon size={24} />
        </div>
        <span className="text-sm font-bold text-gray-400">Bước {step}</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
        {description}
      </p>
      
      <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
          isLocked 
          ? 'bg-gray-200 text-gray-500 hover:bg-gray-300 active:scale-95' 
          : status === 'completed' 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
        }`}
      >
        {status === 'completed' ? t('completed') : t('start_now')}
        <ArrowRight size={18} className={status === 'completed' ? 'hidden' : ''} />
      </button>
      
      {status === 'completed' && (
        <div className="absolute top-1 right-1 bg-green-500 text-white p-1 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default SetupStepCard;