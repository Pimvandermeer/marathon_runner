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
    <div className="mt-8 pt-6 border-t border-neutral-200">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-neutral-900">Where to Watch</h3>
        {hasLocations && (
          <Button variant="outline" size="sm" className="text-primary hover:text-white hover:bg-primary">
            <Download className="h-4 w-4 mr-2" />
            Save Itinerary
          </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg p-5 mb-4 border border-neutral-100 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-6">
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
          <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="bg-blue-50 rounded-full p-3 mb-3">
              <Info className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-neutral-700 mb-2 font-medium">No Viewing Locations Yet</p>
            <p className="text-neutral-500 max-w-sm">
              Enter runner details in the form above to see calculated viewing locations and times
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
