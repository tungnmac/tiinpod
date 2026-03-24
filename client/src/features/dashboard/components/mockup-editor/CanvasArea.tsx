import React, { memo } from 'react';
import { DesignElement, ProductTemplate, ProductView } from './types';

interface CanvasAreaProps {
  template: ProductTemplate;
  elements: DesignElement[];
  selectedId: string | null;
  activeViewId: string | number;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onViewChange?: (viewId: string | number) => void;
  captureRef?: React.RefObject<HTMLDivElement>;
}

export const CanvasArea: React.FC<CanvasAreaProps> = memo(({
  template,
  elements,
  selectedId,
  activeViewId,
  onSelect,
  onViewChange,
  captureRef
}) => {
  const currentView = template.views?.find(v => v.id === activeViewId) || { image_url: template.image_url };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 select-none bg-gray-50/20">
      
      <div 
        ref={captureRef}
        data-capture-container="true"
        className="relative w-full h-full max-w-2xl aspect-[4/5] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex items-center justify-center p-0 ring-1 ring-gray-100"
        style={{ transform: 'translateZ(0)' }}
      >
        <img 
          src={currentView.image_url} 
          alt="mockup" 
          crossOrigin="anonymous"
          className="w-full h-full object-cover pointer-events-none transition-all duration-500" 
        />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[45%] h-[55%] border-2 border-dashed border-indigo-400/20 rounded-lg overflow-visible">
          {elements.filter(el => !el.viewId || el.viewId === activeViewId).map((el) => el.isVisible && (
            <div 
              key={el.id}
              id={`el-${el.id}`}
              onMouseDown={(e) => onSelect(el.id, e)}
              className={`absolute cursor-move transition-shadow ${selectedId === el.id ? 'ring-2 ring-indigo-500 shadow-xl z-50 selection-handle' : 'hover:ring-1 hover:ring-indigo-300'}`}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${el.x}px), calc(-50% + ${el.y}px)) 
                          scale(${el.scale}) 
                          rotate(${el.rotate}deg)`,
                opacity: el.opacity / 100,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                whiteSpace: 'pre'
              }}
            >
              {el.type === 'image' ? (
                <img 
                  src={el.url} 
                  crossOrigin="anonymous"
                  className="max-w-screen max-h-screen object-contain pointer-events-none" 
                  alt="layered" 
                />
              ) : (
                <span 
                  className="font-bold select-none"
                  style={{ 
                    color: el.color, 
                    fontSize: `${el.fontSize}px`, 
                    fontFamily: `${el.fontFamily || 'Inter'}, sans-serif`,
                    fontWeight: el.fontWeight || 'bold',
                    fontStyle: el.fontStyle || 'normal',
                    textDecoration: el.textDecoration || 'none',
                    textAlign: el.textAlign || 'center',
                    maxWidth: `${el.maxWidth || 300}px`,
                    display: 'block',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    transformOrigin: 'center center',
                    lineHeight: 1.2
                  }}
                >
                  {el.curve && el.curve !== 0 ? (
                    // Refined Curved Text Implementation
                    el.text?.split('').map((char, i) => {
                      const textLen = el.text?.length || 1;
                      // Sensitivity adjustment: larger absolute curve = smaller radius (more curve)
                      const radius = 300 * (100 / Math.abs(el.curve!));
                      
                      // Angle is distributed around 0
                      const anglePerChar = (el.curve! / textLen) * 0.8; // scaling factor for better spread
                      const angle = (i - (textLen - 1) / 2) * anglePerChar;
                      const rad = angle * (Math.PI / 180);
                      
                      // Calculate polar coordinates for position
                      const x = radius * Math.sin(rad);
                      const y = radius * (1 - Math.cos(rad));
                      
                      return (
                        <span 
                          key={i} 
                          style={{ 
                            display: 'inline-block',
                            position: 'absolute', // Absolute within the container for rotation
                            left: '50%',
                            top: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${el.curve! > 0 ? y : -y}px)) rotate(${angle}deg)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          {char}
                        </span>
                      );
                    })
                  ) : (
                    el.text
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
