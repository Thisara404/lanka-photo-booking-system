
import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  presetName?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  className = '',
  presetName
}: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLImageElement>(null);
  const afterImageRef = useRef<HTMLImageElement>(null);

  // Simulate preset application filters for "after" image
  const applyPresetEffects = (target: "before" | "after") => {
    const filters = {
      before: '',
      after: target === "after" ? 'contrast(1.1) brightness(1.05) saturate(1.15)' : ''
    };

    return {
      filter: filters[target]
    };
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const calculatePosition = (clientX: number) => {
    if (!sliderRef.current) return;
    const {
      left,
      width
    } = sliderRef.current.getBoundingClientRect();
    let pos = (clientX - left) / width * 100;
    pos = Math.min(Math.max(pos, 0), 100);
    setPosition(pos);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    calculatePosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    calculatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleImagesLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={`before-after-slider relative h-full w-full overflow-hidden ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} 
      ref={sliderRef}
    >
      {/* After image (edited with preset) */}
      <div className="absolute inset-0 transition-transform duration-200 ease-in-out">
        <img 
          src={afterImage} 
          alt="After" 
          className="w-full h-full object-cover"
          ref={afterImageRef}
          onLoad={handleImagesLoaded}
          style={{
            ...applyPresetEffects("after"),
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 text-xs text-white rounded-full">Edited</div>
      </div>
      
      {/* Before image (raw photo) */}
      <div className="absolute inset-0 overflow-hidden transition-all duration-200" style={{
        width: `${position}%`
      }}>
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute top-0 left-0 w-full h-full object-cover" 
          ref={beforeImageRef}
          style={{
            width: `${100 / (position / 100)}%`,
            minWidth: '100%',
            ...applyPresetEffects("before"),
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-2 py-1 text-xs text-white rounded-full">RAW</div>
      </div>
      
      {/* Divider */}
      <div 
        className="slider-divider absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_5px_rgba(0,0,0,0.7)] z-10 transition-transform duration-75" 
        style={{
          left: `${position}%`,
          transform: isDragging ? 'scaleX(1.5)' : 'scaleX(1)'
        }} 
      />
      
      {/* Handle */}
      <div 
        className="slider-handle absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10 cursor-grab active:cursor-grabbing transition-all duration-150" 
        style={{
          left: `${position}%`,
          transform: `translate(-50%, -50%) scale(${isDragging ? 1.1 : 1})`,
          boxShadow: isDragging ? '0 0 0 4px rgba(255,255,255,0.3), 0 0 10px rgba(0,0,0,0.5)' : '0 0 5px rgba(0,0,0,0.5)'
        }} 
        onMouseDown={handleMouseDown} 
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L8 16M8 8L16 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      {/* Preset name if provided */}
      {presetName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium z-20 animate-fade-in">
          {presetName} Preset
        </div>
      )}

      {/* "Drag to compare" text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full z-10 animate-fade-in opacity-70 hover:opacity-100 transition-opacity">
        Drag to compare
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
