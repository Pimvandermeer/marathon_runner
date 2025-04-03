import { useState } from 'react';
import { getCurrentMarathon } from '@/data/marathonConfig';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RouteMap() {
  const { t } = useLanguage();
  const [isMapEnlarged, setIsMapEnlarged] = useState(false);
  const marathon = getCurrentMarathon();
  
  const toggleMapSize = () => {
    setIsMapEnlarged(!isMapEnlarged);
  };
  
  return (
    <div className="relative mt-4 mb-8">
      <h2 className="text-xl font-semibold mb-2">{t('map.title')}</h2>
      <div 
        className={`route-map-container rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 ${isMapEnlarged ? 'h-[70vh]' : 'h-[300px]'}`}
      >
        <img 
          src={marathon.routeMap} 
          alt={`${marathon.name} route map`} 
          className="w-full h-full object-contain p-2 cursor-pointer hover:opacity-95 transition-opacity"
          onClick={toggleMapSize}
        />
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