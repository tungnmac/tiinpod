import React from 'react';
import { SceneObject } from '../../types/scene';

interface SceneCanvasProps {
  backgroundUrl: string;
  objects: SceneObject[];
  selectedId: string | null;
  onSelect: (id: string, e: React.MouseEvent) => void;
  captureRef?: React.RefObject<HTMLDivElement>;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  backgroundUrl,
  objects,
  selectedId,
  onSelect,
  captureRef
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#f0f2f5] overflow-hidden select-none">
      <div 
        ref={captureRef}
        data-capture-container="true"
        className="relative w-full h-full max-w-5xl aspect-video bg-white shadow-2xl overflow-hidden"
      >
        {/* Background Layer */}
        <img 
          src={backgroundUrl} 
          alt="scene-bg" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Dynamic Scene Objects */}
        {objects
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map((obj) => (
            <div
              key={obj.id}
              onMouseDown={(e) => onSelect(obj.id, e)}
              className={`absolute cursor-move transition-shadow flex items-center justify-center ${
                selectedId === obj.id ? 'ring-2 ring-indigo-500 ring-offset-2 z-[1000]' : 'hover:outline hover:outline-1 hover:outline-indigo-300'
              }`}
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: 'center center',
                transform: `translate(calc(-50% + ${obj.x}px), calc(-50% + ${obj.y}px)) 
                            rotate(${obj.rotate}deg) 
                            scale(${obj.scale})
                            ${obj.flipX ? 'scaleX(-1)' : ''}`,
                opacity: (obj.opacity || 100) / 100,
                width: obj.width || 200,
                height: 'auto',
                zIndex: obj.zIndex || 1,
                filter: selectedId === obj.id ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.05))',
                willChange: 'transform'
              }}
            >
              <img 
                src={obj.url} 
                alt={obj.id} 
                className="w-full h-auto pointer-events-none select-none block"
                crossOrigin="anonymous"
                style={{
                  display: 'block',
                  userSelect: 'none'
                }}
              />
              
              {/* Optional: Resize Handle Visualizers could go here like Photoshop */}
              {selectedId === obj.id && (
                <div className="absolute inset-0 border border-white/50 pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-indigo-500"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-indigo-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-indigo-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-indigo-500"></div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
