import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import marathonMapSrc from "@assets/NNMR25-parcourskaart_NN-Marathon-1086x1536.jpg";

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
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Marathon Route Map</h2>
        <div className="rounded-lg overflow-hidden relative">
          <div className="max-h-[600px] overflow-hidden">
            <img 
              src={marathonMapSrc} 
              alt="Rotterdam Marathon Route Map" 
              className="w-full object-contain rounded-lg shadow-md"
            />
          </div>
          
          {hasRunnerInfo && (
            <div className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-md shadow text-sm">
              <p className="font-medium text-neutral-700">
                Runner: {runnerInfo.name || "Runner"} - Wave {runnerInfo.wave}
              </p>
              <p className="text-xs text-neutral-600">Pace: {runnerInfo.pace} min/km</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}