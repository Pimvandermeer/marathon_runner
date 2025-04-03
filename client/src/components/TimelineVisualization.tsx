import { useState, useEffect } from "react";
import { formatDistance, timeStringToMinutes, getPaceTrend } from "@/lib/utils";
import { marathonLandmarks } from "@shared/schema";
import { Timer, Flag, Clock, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TimelineVisualizationProps {
  currentPosition: number;
  elapsedTime: string;
  estimatedFinish: string;
  expectedPace?: string; // Pace expected in min/km
  actualPace?: string;   // Actual pace currently being maintained
}

export default function TimelineVisualization({
  currentPosition,
  elapsedTime,
  estimatedFinish,
  expectedPace,
  actualPace
}: TimelineVisualizationProps) {
  const { t } = useLanguage();
  const [markers, setMarkers] = useState<Array<{distance: number, position: number, active: boolean, name: string}>>([]);
  const remainingDistance = 42.195 - currentPosition;
  
  // Determine if runner is ahead, behind, or on pace
  const paceTrend = expectedPace && actualPace 
    ? getPaceTrend(expectedPace, actualPace) 
    : 'on-target';
  
  useEffect(() => {
    // Create markers based on marathon landmarks
    const newMarkers = marathonLandmarks.map(landmark => {
      const position = (landmark.distance / 42.195) * 100;
      return {
        distance: landmark.distance,
        position,
        name: landmark.name,
        active: currentPosition >= landmark.distance - 0.5 && currentPosition <= landmark.distance + 0.5
      };
    });
    
    setMarkers(newMarkers);
  }, [currentPosition]);
  
  return (
    <div className="relative mb-8 px-2">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800">Runner Progress</h3>
        <div className="text-sm text-neutral-500">
          {formatDistance(currentPosition)} of {formatDistance(42.195)}
        </div>
      </div>
      
      {/* Timeline track with gradient progress */}
      <div className="h-2.5 bg-neutral-200 rounded-full relative mb-10 overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-blue-500 to-primary rounded-full"
          style={{ width: `${(currentPosition / 42.195) * 100}%` }}
        />
        
        {/* Runner position indicator with pulsing effect */}
        <div 
          className="absolute h-5 w-5 bg-primary rounded-full shadow-lg shadow-primary/40 border-2 border-white z-10 top-1/2 transform -translate-y-1/2 -translate-x-1/2 animate-pulse"
          style={{ left: `${(currentPosition / 42.195) * 100}%` }}
        />
        
        {/* Static markers */}
        {markers.map((marker, index) => (
          <div 
            key={index}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 group"
            style={{ left: `${marker.position}%` }}
          >
            <div 
              className={`w-3 h-3 rounded-full ${
                marker.active ? 'bg-primary scale-125' : 'bg-secondary'
              } border border-white transition-all duration-300`}
            />
            
            {/* Marker tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 mb-1
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                          bg-white p-2 rounded-md shadow-md text-xs min-w-[80px] text-center z-10 pointer-events-none">
              <div className="font-semibold text-neutral-900">{marker.name}</div>
              <div className="text-neutral-600">{marker.distance.toFixed(1)} km</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Distance labels - properly positioned under the timeline */}
      <div className="flex justify-between text-xs font-medium text-neutral-600 absolute w-full -bottom-6 left-0">
        {marathonLandmarks.map((landmark, index) => (
          <div 
            key={index} 
            className="absolute transform -translate-x-1/2 text-center"
            style={{ 
              left: `${(landmark.distance / 42.195) * 100}%`,
              width: "40px"
            }}
          >
            {landmark.distance === 21.1 ? "21.1" : Math.round(landmark.distance)}
          </div>
        ))}
      </div>
      
      {/* Pace trend indicator (only shown if we have pace data) */}
      {expectedPace && actualPace && (
        <div className={`flex items-center justify-center p-3 mb-4 rounded-lg shadow-sm text-white ${
          paceTrend === 'faster' ? 'bg-green-500' 
          : paceTrend === 'slower' ? 'bg-orange-500' 
          : 'bg-blue-500'
        }`}>
          <div className="flex items-center">
            {paceTrend === 'faster' ? (
              <>
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Runner is ahead of pace ({actualPace} min/km vs expected {expectedPace} min/km)
                </span>
              </>
            ) : paceTrend === 'slower' ? (
              <>
                <TrendingDown className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Runner is behind pace ({actualPace} min/km vs expected {expectedPace} min/km)
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Runner is on target pace ({actualPace} min/km)
                </span>
              </>
            )}
          </div>
        </div>
      )}
    
      {/* Stats cards with improved styling and icons */}
      <div className="grid grid-cols-3 gap-4 mt-16">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center mb-2">
            <Flag className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">{t("timeline.distance")}</span>
          </div>
          <span className="text-xl font-semibold text-neutral-900 block">
            {formatDistance(currentPosition)}
          </span>
          <span className="text-xs text-blue-700 mt-1 block">
            {formatDistance(remainingDistance)} to finish
          </span>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="flex items-center mb-2">
            <Timer className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">{t("status.elapsed")}</span>
          </div>
          <span className="text-xl font-mono font-semibold text-neutral-900">
            {elapsedTime}
          </span>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">{t("status.finishTime")}</span>
          </div>
          <span className="text-xl font-mono font-semibold text-neutral-900">
            {estimatedFinish}
          </span>
        </div>
      </div>
    </div>
  );
}
