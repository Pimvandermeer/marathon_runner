import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ZoomableImageProps {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

export function ZoomableImage({ src, alt, onClick, className = "" }: ZoomableImageProps) {
  const { t } = useLanguage();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Reset zoom and position when src changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Calculate new scale
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 1), 5); // Limit scale between 1 and 5
    
    // Only update if changed
    if (newScale !== scale) {
      setScale(newScale);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if we're zoomed in
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    } else if (onClick) {
      onClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start dragging if we're zoomed in
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    } else if (onClick && scale === 1) {
      onClick();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault(); // Prevent scrolling when dragging
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDoubleTap = () => {
    if (scale > 1) {
      // Reset zoom if already zoomed in
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      // Zoom in
      setScale(2.5);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden relative touch-none ${className}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleTap}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition-transform duration-100"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'center center',
          cursor: scale > 1 ? 'grab' : 'pointer',
        }}
        draggable={false}
      />
      
      {/* Zoom controls */}
      <div className="absolute bottom-2 right-2 flex space-x-1 bg-white/80 p-1 rounded-md shadow-sm">
        <button 
          onClick={() => setScale(Math.max(scale - 0.5, 1))}
          className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-100 border border-gray-200"
          disabled={scale <= 1}
          title={t('map.zoom_out')}
          aria-label={t('map.zoom_out')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={() => {
            if (scale === 1) {
              setPosition({ x: 0, y: 0 });
            }
            setScale(Math.min(scale + 0.5, 5))
          }}
          className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-100 border border-gray-200"
          title={t('map.zoom_in')}
          aria-label={t('map.zoom_in')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        {scale > 1 && (
          <button 
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-100 border border-gray-200"
            title={t('map.reset')}
            aria-label={t('map.reset')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          </button>
        )}
      </div>
      
      {/* Instructions overlay */}
      {scale === 1 && (
        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs shadow-sm pointer-events-none">
          {t('map.double_tap')}
        </div>
      )}
    </div>
  );
}