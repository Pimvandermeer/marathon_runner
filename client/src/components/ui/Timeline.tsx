import { Card, CardContent } from "@/components/ui/card";
import TimelineVisualization from "@/components/TimelineVisualization";
import LocationResults from "@/components/LocationResults";
import { type LocationTime } from "@shared/schema";
import { Link, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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

  const createShareableLink = () => {
    if (!runnerInfo) return;
    
    // Create URL parameters from runner info
    const params = new URLSearchParams();
    params.append('name', runnerInfo.name || 'Runner');
    params.append('wave', runnerInfo.wave);
    params.append('pace', runnerInfo.pace);
    
    // Create the shareable URL with the current domain
    const shareableUrl = `${window.location.origin}?${params.toString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Shareable link has been copied to clipboard",
          variant: "default",
        });
      })
      .catch(err => {
        console.error('Could not copy link: ', err);
        toast({
          title: "Could not copy link",
          description: "Please try again or copy the URL manually",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Card className="bg-white shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Runner Timeline</h2>
          <div className="flex items-center gap-3">
            {hasRunnerInfo && (
              <>
                <div className="text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                  {runnerInfo.name ? runnerInfo.name : "Runner"} - Wave {runnerInfo.wave} - Pace {runnerInfo.pace} min/km
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 text-sm"
                  onClick={createShareableLink}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </>
            )}
          </div>
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
        
        {/* Additional info for marathon supporters */}
        {hasRunnerInfo && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-md font-semibold text-blue-800 mb-2">Supporter Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex gap-2 items-start">
                <span className="rounded-full bg-blue-200 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 7 17l-5-5" />
                  </svg>
                </span>
                Plan to arrive at each location 15-20 minutes before the estimated time
              </li>
              <li className="flex gap-2 items-start">
                <span className="rounded-full bg-blue-200 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 7 17l-5-5" />
                  </svg>
                </span>
                Use public transport between viewing locations - the city gets crowded
              </li>
              <li className="flex gap-2 items-start">
                <span className="rounded-full bg-blue-200 p-1 mt-0.5">
                  <svg className="h-3 w-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 7 17l-5-5" />
                  </svg>
                </span>
                Bring encouraging signs and noise makers to cheer on the runners
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
