import { useState } from "react";
import LocationItem from "./LocationItem";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import { type LocationTime } from "@shared/schema";

interface LocationResultsProps {
  locations: LocationTime[];
  isLoading?: boolean;
}

export default function LocationResults({ locations, isLoading = false }: LocationResultsProps) {
  const hasLocations = locations && locations.length > 0;
  
  return (
    <div className="mt-6 pt-6 border-t border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-neutral-900">Where to Watch</h3>
        {hasLocations && (
          <Button variant="ghost" className="text-secondary text-sm font-medium">
            <Download className="h-4 w-4 mr-1" />
            Save as PDF
          </Button>
        )}
      </div>
      
      <div className="bg-neutral-50 rounded-lg p-4 mb-4 border border-neutral-200">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : !hasLocations ? (
          <div className="text-center text-neutral-500 italic py-4">
            <Info className="h-5 w-5 mx-auto mb-2" />
            Enter runner details to see calculated viewing locations and times
          </div>
        ) : (
          <div>
            {locations.map((location, index) => (
              <LocationItem 
                key={index} 
                location={location} 
                isFinish={location.kilometer >= 42} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
