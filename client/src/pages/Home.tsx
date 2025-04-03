import { useState, useEffect } from "react";
import RunnerForm from "@/components/RunnerForm";
import Timeline from "@/components/ui/Timeline";
import RouteMap from "@/components/RouteMap";
import { type LocationTime, type RunnerPredictionResult, type RunnerInput } from "@shared/schema";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculateRunnerPredictions } from "@/data/staticData";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Define a type for our runner data
type RunnerData = {
  id: string;
  info: {
    name: string;
    wave: string;
    pace: string;
  };
  currentLocation: {
    distance: number;
    elapsedTime: string;
    estimatedFinish: string;
  };
  locations: LocationTime[];
};

export default function Home() {
  // Keep track of multiple runners
  const [runners, setRunners] = useState<RunnerData[]>([]);
  const [selectedRunnerId, setSelectedRunnerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sharedLinkLoaded, setSharedLinkLoaded] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Get the currently selected runner data
  const selectedRunner = runners.find(r => r.id === selectedRunnerId);
  
  // Parse URL parameters if available (for shared links)
  useEffect(() => {
    if (sharedLinkLoaded) return;
    
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const wave = params.get('wave');
    const pace = params.get('pace');
    
    // If we have all the parameters, create a runner
    if (wave && pace) {
      setIsLoading(true);
      
      try {
        // Validate wave number
        if (!["1", "2", "3", "4", "5"].includes(wave)) {
          throw new Error("Invalid wave number");
        }
        
        const runnerInput: RunnerInput = {
          runnerName: name || 'Shared Runner',
          wave: wave as "1" | "2" | "3" | "4" | "5",
          pace
        };
        
        // Calculate predictions
        const result = calculateRunnerPredictions(runnerInput);
        
        if (result) {
          handleSubmitSuccess(result);
          setSharedLinkLoaded(true);
          
          toast({
            title: "Shared runner loaded",
            description: `Runner information has been loaded from a shared link`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error loading shared runner:", error);
        toast({
          title: "Could not load shared runner",
          description: "The shared link may be invalid",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, []);
  
  const handleSubmitSuccess = (data: RunnerPredictionResult) => {
    if (data.locationTimes && data.currentLocation && data.runner) {
      // Create a new runner object
      const newRunner: RunnerData = {
        id: data.runner.id,
        info: {
          name: data.runner.name,
          wave: data.runner.wave,
          pace: data.runner.pace
        },
        currentLocation: data.currentLocation,
        locations: data.locationTimes
      };
      
      // Check if we already have this runner (by ID)
      const existingRunnerIndex = runners.findIndex(r => r.id === data.runner.id);
      
      if (existingRunnerIndex >= 0) {
        // Update existing runner
        const updatedRunners = [...runners];
        updatedRunners[existingRunnerIndex] = newRunner;
        setRunners(updatedRunners);
      } else {
        // Add new runner
        setRunners(prev => [...prev, newRunner]);
      }
      
      // Select this runner
      setSelectedRunnerId(data.runner.id);
    }
  };
  
  // Remove a runner
  const removeRunner = (id: string) => {
    setRunners(prev => prev.filter(runner => runner.id !== id));
    
    // If we removed the selected runner, select another one if available
    if (id === selectedRunnerId) {
      const remainingRunners = runners.filter(runner => runner.id !== id);
      setSelectedRunnerId(remainingRunners.length > 0 ? remainingRunners[0].id : null);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-primary rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="px-6 py-10 md:px-10 md:py-16 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("app.title")}</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            {t("app.subtitle")}
          </p>
        </div>
      </div>
      
      {/* Marathon Route Map */}
      <h2 className="text-2xl font-bold mb-4">Rotterdam Marathon 2025 Route</h2>
      <RouteMap runnerInfo={selectedRunner?.info} />
      
      {/* Runner Information and Timeline */}
      <h2 className="text-2xl font-bold mb-4">{t("timeline.title")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <RunnerForm onSubmitSuccess={handleSubmitSuccess} />
          
          {/* Tracked Runners List */}
          {runners.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tracked Runners</CardTitle>
                <CardDescription>
                  You are currently tracking {runners.length} runner{runners.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {runners.map(runner => (
                    <div 
                      key={runner.id}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        selectedRunnerId === runner.id 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-neutral-100 hover:bg-neutral-200'
                      }`}
                    >
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedRunnerId(runner.id)}
                      >
                        <p className="font-medium">{runner.info.name}</p>
                        <p className="text-sm text-neutral-600">Wave {runner.info.wave} - Pace {runner.info.pace}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeRunner(runner.id)}
                        className="text-neutral-500 hover:text-rose-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedRunner ? (
            <Timeline 
              runnerInfo={selectedRunner.info}
              currentLocation={selectedRunner.currentLocation}
              locations={selectedRunner.locations}
              isLoading={isLoading}
            />
          ) : (
            <Card className="shadow-md mb-6">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="text-neutral-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20a6 6 0 0 0-12 0"></path>
                    <circle cx="12" cy="10" r="4"></circle>
                    <path d="M8 14v.5"></path>
                    <path d="M16 14v.5"></path>
                    <path d="M16 19h6"></path>
                    <path d="M2 19h6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">No Runners Added Yet</h3>
                <p className="text-neutral-600 mb-4">Add a runner using the form to start tracking their estimated location.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
