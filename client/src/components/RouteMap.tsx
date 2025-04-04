import { useState } from 'react';
import { getCurrentMarathon } from '@/data/marathonConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { ZoomableImage } from './ZoomableImage';

interface RouteMapProps {
  hasRunners?: boolean;
}

export default function RouteMap({ hasRunners = false }: RouteMapProps) {
  const { t } = useLanguage();
  const [isMapEnlarged, setIsMapEnlarged] = useState(false);
  const marathon = getCurrentMarathon();
  
  const toggleMapSize = () => {
    setIsMapEnlarged(!isMapEnlarged);
  };
  
  return (
    <div className="relative mt-4 mb-8">
      <h2 className={`${hasRunners ? 'text-lg' : 'text-xl'} font-semibold mb-2 transition-all duration-300`}>{t('map.title')}</h2>
      
      {/* Background overlay when map is enlarged */}
      {isMapEnlarged && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMapSize}
        ></div>
      )}
      
      <div 
        className={`route-map-container rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 ${isMapEnlarged ? 'h-[85vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] bg-white shadow-2xl' : 'h-[300px]'}`}
      >
        {isMapEnlarged && (
          <button 
            onClick={toggleMapSize}
            className="absolute top-2 right-2 bg-white rounded-full p-1 z-50 shadow-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        
        {isMapEnlarged ? (
          <ZoomableImage 
            src={marathon.routeMap} 
            alt={`${marathon.name} route map`} 
            className="w-full h-full p-2"
          />
        ) : (
          <img 
            src={marathon.routeMap} 
            alt={`${marathon.name} route map`} 
            className="w-full h-full object-contain p-2 cursor-pointer hover:opacity-95 transition-opacity"
            onClick={toggleMapSize}
          />
        )}
      </div>
      
      <div className="flex justify-end mt-2">
        <button 
          onClick={toggleMapSize}
          className="text-sm text-primary hover:underline"
        >
          {isMapEnlarged ? t('map.shrink') : t('map.enlarge')}
        </button>
      </div>
    </div>
  );
}