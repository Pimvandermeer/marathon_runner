import { Card, CardContent } from "@/components/ui/card";
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
      <CardContent className="p-6 overflow-hidden">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Rotterdam Marathon Route Map</h2>
        </div>
        
        <div className="rounded-lg overflow-hidden relative flex justify-center">
          <div style={{ width: "90%", maxWidth: "800px", height: "auto", display: "block", position: "relative" }}>
            <img 
              src={marathonMapSrc} 
              alt="Rotterdam Marathon Route Map" 
              className="w-full h-auto object-contain rounded-lg shadow-md"
              style={{ display: "block", maxWidth: "100%" }}
            />
          </div>
          
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
          <p>Rotterdam Marathon - April 13, 2025</p>
        </div>
      </CardContent>
    </Card>
  );
}