import { useState } from "react";
import RunnerForm from "@/components/RunnerForm";
import Timeline from "@/components/ui/Timeline";
import { type LocationTime, type RunnerInput } from "@shared/schema";

export default function Home() {
  const [runnerInfo, setRunnerInfo] = useState<{
    name: string;
    wave: string;
    pace: string;
  } | undefined>(undefined);
  
  const [currentLocation, setCurrentLocation] = useState<{
    distance: number;
    elapsedTime: string;
    estimatedFinish: string;
  } | undefined>(undefined);
  
  const [locations, setLocations] = useState<LocationTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmitSuccess = (data: any) => {
    if (data.locationTimes && data.currentLocation) {
      setLocations(data.locationTimes);
      setCurrentLocation(data.currentLocation);
      
      // Get the runner name from the form
      const runnerName = document.getElementById('runnerName') as HTMLInputElement;
      const waveName = document.querySelector('[name="wave"]') as HTMLSelectElement;
      const paceName = document.querySelector('[name="pace"]') as HTMLInputElement;
      
      setRunnerInfo({
        name: runnerName?.value || "Your Runner",
        wave: waveName?.value || "",
        pace: paceName?.value || ""
      });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-primary rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="px-6 py-10 md:px-10 md:py-16 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Marathon Runner Supporter Guide</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Enter your runner's wave and expected pace to get precise location predictions throughout the marathon.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RunnerForm onSubmitSuccess={handleSubmitSuccess} />
        <Timeline 
          runnerInfo={runnerInfo}
          currentLocation={currentLocation}
          locations={locations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
