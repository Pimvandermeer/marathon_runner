import { Card, CardContent } from "@/components/ui/card";
import TimelineVisualization from "@/components/TimelineVisualization";
import LocationResults from "@/components/LocationResults";
import { type LocationTime } from "@shared/schema";
import { Download, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineProps {
  runnerInfo?: {
    name: string;
    wave: string;
    pace: string;
  };
  currentLocation?: {
    distance: number;
    elapsedTime: string;
    estimatedFinish: string;
  };
  locations: LocationTime[];
  isLoading: boolean;
}

export default function Timeline({ 
  runnerInfo, 
  currentLocation, 
  locations, 
  isLoading 
}: TimelineProps) {
  const hasRunnerInfo = !!runnerInfo;
  
  return (
    <div className="lg:col-span-2">
      {/* Timeline Card */}
      <Card className="bg-white shadow-md mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Runner Timeline</h2>
            {hasRunnerInfo && (
              <div className="text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                {runnerInfo.name ? runnerInfo.name : "Runner"} - Wave {runnerInfo.wave} - Pace {runnerInfo.pace} min/km
              </div>
            )}
          </div>
          
          {/* Timeline visualization */}
          {!hasRunnerInfo ? (
            <div className="h-40 flex items-center justify-center bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-neutral-500">Submit runner information to see timeline</p>
            </div>
          ) : (
            <TimelineVisualization 
              currentPosition={currentLocation?.distance || 0}
              elapsedTime={currentLocation?.elapsedTime || "00:00:00"}
              estimatedFinish={currentLocation?.estimatedFinish || "00:00:00"}
            />
          )}
          
          <LocationResults 
            locations={locations} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Map Card */}
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Marathon Route Map</h2>
          <div className="bg-neutral-200 rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
            <div className="text-neutral-600">
              <Map className="h-12 w-12 mx-auto mb-2 text-neutral-400" />
              <p className="text-center">Interactive Marathon Route Map</p>
              <p className="text-sm text-center mt-1">Shows runner's current position and recommended viewing locations</p>
            </div>
            
            {hasRunnerInfo && (
              <>
                <div className="absolute" style={{ top: "40%", left: "25%" }}>
                  <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <Map className="h-3 w-3" />
                  </div>
                </div>
                <div className="absolute" style={{ top: "50%", left: "45%" }}>
                  <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <Map className="h-3 w-3" />
                  </div>
                </div>
                <div className="absolute" style={{ top: "30%", left: "65%" }}>
                  <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <Map className="h-3 w-3" />
                  </div>
                </div>
                <div className="absolute" style={{ top: "60%", left: "75%" }}>
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
                    <span className="text-xs">▶</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-neutral-700">
              <svg className="h-4 w-4 mr-1 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <path d="M9 9h6v6H9z"></path>
              </svg>
              Parking
            </Button>
            <Button variant="outline" size="sm" className="text-neutral-700">
              <svg className="h-4 w-4 mr-1 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                <path d="M12 12v6"></path>
                <path d="M8 12v6"></path>
                <path d="M16 12v6"></path>
              </svg>
              Public Transport
            </Button>
            <Button variant="outline" size="sm" className="text-neutral-700">
              <svg className="h-4 w-4 mr-1 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Food & Drinks
            </Button>
            <Button variant="outline" size="sm" className="text-neutral-700">
              <svg className="h-4 w-4 mr-1 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v5"></path>
                <path d="M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10"></path>
                <path d="M22 10H2"></path>
                <path d="M15 5V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2"></path>
              </svg>
              Restrooms
            </Button>
            <Button variant="outline" size="sm" className="text-neutral-700">
              <svg className="h-4 w-4 mr-1 text-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 3v12h-5c-.023 0-.047 0-.07.003a3.01 3.01 0 0 0-2.93 3.057v1.998c0 .365.008.572.05.702a.9.9 0 0 0 .236.346c.086.08.196.129.408.179L15 22"></path>
                <path d="M5 3v12h5c.023 0 .047 0 .07.003a3.01 3.01 0 0 1 2.93 3.057v1.998c0 .365-.008.572-.05.702a.9.9 0 0 1-.236.346c-.086.08-.196.129-.408.179L9 22"></path>
              </svg>
              First Aid
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
