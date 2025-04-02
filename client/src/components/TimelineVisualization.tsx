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
    <div className="relative">
      <div className="timeline-track mb-14 h-1 bg-neutral-200 relative">
        {markers.map((marker, index) => (
          <div 
            key={index}
            className={`absolute w-4 h-4 rounded-full bg-secondary top-1/2 transform -translate-y-1/2 -translate-x-1/2 ${marker.active ? 'active bg-primary shadow-lg shadow-primary/30' : ''}`}
            style={{ left: `${marker.position}%` }}
          />
        ))}
      </div>
      
      {/* Distance labels */}
      <div className="flex justify-between text-sm text-neutral-600 absolute w-full">
        {marathonLandmarks.map((landmark, index) => (
          <div 
            key={index} 
            className="text-center"
            style={{ 
              width: landmark.distance === 42.195 ? "40px" : "20px", 
              marginLeft: index === 0 ? "-8px" : undefined,
              marginRight: index === marathonLandmarks.length - 1 ? "-12px" : undefined
            }}
          >
            {landmark.distance === 21.1 ? "21.1" : Math.round(landmark.distance)}
          </div>
        ))}
      </div>
      
      {/* Landmark labels */}
      <div className="flex justify-between text-xs text-neutral-500 mt-6 absolute w-full">
        {marathonLandmarks.map((landmark, index) => (
          <div 
            key={index} 
            className="text-center"
            style={{ 
              width: "50px", 
              marginLeft: index === 0 ? "-12px" : "-25px",
              marginRight: index === marathonLandmarks.length - 1 ? "-8px" : undefined
            }}
          >
            {landmark.name}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-10 pt-4">
        <div>
          <span className="block text-sm text-neutral-500">Current Position</span>
          <span className="text-xl font-semibold text-neutral-900">
            {formatDistance(currentPosition)}
          </span>
        </div>
        <div>
          <span className="block text-sm text-neutral-500">Elapsed Time</span>
          <span className="text-xl font-mono font-semibold text-neutral-900">
            {elapsedTime}
          </span>
        </div>
        <div>
          <span className="block text-sm text-neutral-500">Estimated Finish</span>
          <span className="text-xl font-mono font-semibold text-neutral-900">
            {estimatedFinish}
          </span>
        </div>
      </div>
    </div>
  );
}
