import { useState, useEffect } from "react";
import RunnerForm from "@/components/RunnerForm";
import Timeline from "@/components/ui/Timeline";
import RouteMap from "@/components/RouteMap";
import { ShareDialog } from "@/components/ShareDialog";
import { type LocationTime, type RunnerPredictionResult, type RunnerInput } from "@shared/schema";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculateRunnerPredictions } from "@/data/staticData";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrentMarathon } from "@/data/marathonConfig";

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
  originalPredictions?: LocationTime[];
  actualPace?: string;
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
        // Get current marathon waves
        const marathon = getCurrentMarathon();
        const validWaves = Object.keys(marathon.waveStartTimes);
        
        // Validate wave number
        if (!validWaves.includes(wave)) {
          throw new Error("Invalid wave number");
        }
        
        const runnerInput: RunnerInput = {
          runnerName: name || 'Shared Runner',
          wave: wave as any, // Type will be validated by the schema
          pace
        };
        
        // Calculate predictions
        const result = calculateRunnerPredictions(runnerInput);
        
        if (result) {
          handleSubmitSuccess(result);
          setSharedLinkLoaded(true);
          
          toast({
            title: t("app.shared_runner_loaded"),
            description: t("app.shared_runner_loaded_desc"),
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error loading shared runner:", error);
        toast({
          title: t("app.shared_link_error"),
          description: t("app.shared_link_error_desc"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, []);
  
  const handleSubmitSuccess = (data: RunnerPredictionResult) => {
    if (data.locationTimes && data.currentLocation && data.runner) {
      // Store original predictions when adding a new runner
      const isNewRunner = !runners.some(r => r.id === data.runner.id);
      
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
      
      // For a new runner, store the original predictions
      if (isNewRunner) {
        newRunner.originalPredictions = [...data.locationTimes];
      } else {
        // For existing runner, keep the original predictions but store the updated pace
        const existingRunner = runners.find(r => r.id === data.runner.id);
        if (existingRunner?.originalPredictions) {
          newRunner.originalPredictions = existingRunner.originalPredictions;
          newRunner.actualPace = data.runner.pace;
        }
      }
      
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
  
  // Get current marathon
  const marathon = getCurrentMarathon();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-primary rounded-xl overflow-hidden shadow-lg mb-8">
        <div className={`px-6 ${runners.length > 0 ? 'py-6 md:py-8' : 'py-10 md:py-16'} text-white transition-all duration-300`}>
          <h1 className={`${runners.length > 0 ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-bold ${runners.length > 0 ? 'mb-2' : 'mb-3'} transition-all duration-300`}>
            {t("app.title")}
          </h1>
          <p className={`${runners.length > 0 ? 'text-md md:text-lg' : 'text-lg md:text-xl'} opacity-90 max-w-2xl ${runners.length > 0 ? 'mb-1' : 'mb-3'} transition-all duration-300`}>
            {t("app.subtitle")}
          </p>
          {runners.length === 0 && (
            <p className="text-md opacity-80 max-w-2xl mb-3">
              {t("app.runner_share")}
            </p>
          )}
          
          <p className={`text-sm opacity-70 max-w-2xl ${runners.length > 0 ? 'mb-2' : 'mb-3'}`}>
            {t("app.coming_soon")}
          </p>
          
          {/* Marathon selector hidden until we support multiple marathons */}
        </div>
      </div>
      
      {/* Marathon Route Map */}
      <RouteMap hasRunners={runners.length > 0} />
      
      {/* Runner Information and Timeline */}
      <h2 className={`${runners.length > 0 ? 'text-xl' : 'text-2xl'} font-bold mb-4 transition-all duration-300`}>{t("timeline.title")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* This order is for desktop view - left column contains form and runners list */}
        <div className="order-1 lg:order-1">
          <div className={`${runners.length > 0 ? "scale-95 transform origin-top" : ""} ${runners.length > 0 ? "md:block hidden" : "block"}`}>
            <RunnerForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
          
          {/* Tracked Runners List */}
          {runners.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("app.tracked_runners")}</CardTitle>
                <CardDescription>
                  {t("app.currently_tracking")} {runners.length} {runners.length !== 1 ? t("app.runners") : t("app.runner")}
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
                        <p className="text-sm text-neutral-600">{t("form.wave")} {runner.info.wave} - {t("form.pace")} {runner.info.pace}</p>
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
                
                {/* Share Dialog Button */}
                {runners.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <ShareDialog runners={runners} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* This is the main timeline section - for mobile it appears first */}
        <div className="order-2 lg:order-2 lg:col-span-2">
          {selectedRunner ? (
            <Timeline 
              runnerInfo={selectedRunner.info}
              currentLocation={selectedRunner.currentLocation}
              locations={selectedRunner.locations}
              isLoading={isLoading}
              comparisonData={
                selectedRunner.originalPredictions && selectedRunner.actualPace ? {
                  originalPredictions: selectedRunner.originalPredictions,
                  currentPace: selectedRunner.actualPace
                } : undefined
              }
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
                <h3 className="text-xl font-medium mb-2">{t("app.no_runners_yet")}</h3>
                <p className="text-neutral-600 mb-4">{t("app.add_runner_instruction")}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Mobile-only share button and form section at the bottom when runners are added */}
        {runners.length > 0 && (
          <div className="order-3 lg:hidden mt-4">
            {/* Mobile share button */}
            <div className="mb-6">
              <ShareDialog runners={runners} className="w-full" />
            </div>
            
            <h3 className="text-lg font-medium mb-3">{t("app.add_another_runner")}</h3>
            <div className={runners.length > 0 ? "scale-95 transform origin-top" : ""}>
              <RunnerForm onSubmitSuccess={handleSubmitSuccess} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
