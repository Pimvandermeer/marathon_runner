import { useState, useEffect } from "react";
import { formatDistance } from "@/lib/utils";
import { marathonLandmarks } from "@shared/schema";

interface TimelineVisualizationProps {
  currentPosition: number;
  elapsedTime: string;
  estimatedFinish: string;
}

export default function TimelineVisualization({
  currentPosition,
  elapsedTime,
  estimatedFinish
}: TimelineVisualizationProps) {
  const [markers, setMarkers] = useState<Array<{distance: number, position: number, active: boolean}>>([]);
  
  useEffect(() => {
    // Create markers based on marathon landmarks
    const newMarkers = marathonLandmarks.map(landmark => {
      const position = (landmark.distance / 42.195) * 100;
      return {
        distance: landmark.distance,
        position,
        active: Math.abs(landmark.distance - currentPosition) < 1
      };
    });
    
    setMarkers(newMarkers);
  }, [currentPosition]);
  
  return (
    <div className="relative mb-8 px-2">
      {/* Timeline track with markers */}
      <div className="timeline-track h-2 bg-neutral-200 rounded-full relative mb-10">
        {/* Runner position indicator with glow effect */}
        <div 
          className="absolute h-4 w-4 bg-primary rounded-full shadow-lg shadow-primary/40 border-2 border-white z-10 -top-1 transform -translate-x-1/2"
          style={{ left: `${(currentPosition / 42.195) * 100}%` }}
        />
        
        {/* Static markers */}
        {markers.map((marker, index) => (
          <div 
            key={index}
            className={`absolute w-3 h-3 rounded-full bg-secondary border border-white top-1/2 transform -translate-y-1/2 -translate-x-1/2 ${
              marker.active ? 'bg-primary' : ''
            }`}
            style={{ left: `${marker.position}%` }}
          />
        ))}
      </div>
      
      {/* Distance labels - now properly positioned under the timeline */}
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
      
      {/* Stats cards with improved styling */}
      <div className="grid grid-cols-3 gap-4 mt-16">
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 shadow-sm">
          <span className="block text-sm text-neutral-500 mb-1">Current Position</span>
          <span className="text-xl font-semibold text-neutral-900">
            {formatDistance(currentPosition)}
          </span>
        </div>
        
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 shadow-sm">
          <span className="block text-sm text-neutral-500 mb-1">Elapsed Time</span>
          <span className="text-xl font-mono font-semibold text-neutral-900">
            {elapsedTime}
          </span>
        </div>
        
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 shadow-sm">
          <span className="block text-sm text-neutral-500 mb-1">Estimated Finish</span>
          <span className="text-xl font-mono font-semibold text-neutral-900">
            {estimatedFinish}
          </span>
        </div>
      </div>
    </div>
  );
}
