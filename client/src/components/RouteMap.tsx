import { Card, CardContent } from "@/components/ui/card";
import { Map, MapPin } from "lucide-react";
import marathonMapSrc from "@assets/NNMR25-parcourskaart_NN-Marathon-1086x1536.jpg";
import { defaultViewingLocations } from "@shared/schema";

interface RouteMapProps {
  runnerInfo?: {
    name: string;
    wave: string;
    pace: string;
  };
}

export default function RouteMap({ runnerInfo }: RouteMapProps) {
  const hasRunnerInfo = !!runnerInfo;
  
  return (
    <Card className="bg-white shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Marathon Route Map</h2>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
                <MapPin className="h-5 w-5 absolute -top-1 -left-1 text-secondary" />
              </div>
              <span className="text-neutral-700">Viewing Spots</span>
            </div>
            
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <MapPin className="h-5 w-5 absolute -top-1 -left-1 text-primary" />
              </div>
              <span className="text-neutral-700">Finish Line</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg overflow-hidden relative">
          <div className="max-h-[600px] overflow-hidden">
            <img 
              src={marathonMapSrc} 
              alt="Rotterdam Marathon Route Map" 
              className="w-full object-contain rounded-lg shadow-md"
            />
          </div>
          
          {/* Show interactive viewing spots markers */}
          {defaultViewingLocations.map((location, index) => (
            <div 
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                location.kilometer >= 42 ? 'text-primary' : 'text-secondary'
              }`}
              style={{ 
                left: `${location.mapPositionX}%`, 
                top: `${location.mapPositionY}%`,
              }}
            >
              <div className="relative group">
                <div className="flex items-center justify-center">
                  <div className={`h-4 w-4 rounded-full ${
                    location.kilometer >= 42 ? 'bg-primary' : 'bg-secondary'
                  } shadow-lg`}></div>
                  <MapPin className="h-7 w-7 drop-shadow-md stroke-[3] absolute fill-white/10" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 mb-1
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                              bg-white p-2 rounded shadow-lg text-xs min-w-[120px] z-10 pointer-events-none">
                  <div className="font-medium text-neutral-900">{location.name}</div>
                  <div className="text-neutral-500">{location.kilometer.toFixed(1)} km</div>
                  <div className="text-neutral-500 text-xs mt-1">{location.description}</div>
                </div>
              </div>
            </div>
          ))}
          
          {hasRunnerInfo && (
            <div className="absolute bottom-3 right-3 bg-white/90 p-3 rounded-md shadow-md text-sm">
              <p className="font-medium text-neutral-800">
                Runner: {runnerInfo.name || "Runner"} - Wave {runnerInfo.wave}
              </p>
              <p className="text-neutral-600">Pace: {runnerInfo.pace} min/km</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-blue-700">
          <p>Interactive map with {defaultViewingLocations.length} recommended viewing spots. Hover over markers for details.</p>
        </div>
      </CardContent>
    </Card>
  );
}