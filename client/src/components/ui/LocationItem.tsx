import { MapPin, FlagCheckered } from "lucide-react";
import { type LocationTime } from "@shared/schema";

interface LocationItemProps {
  location: LocationTime;
  isFinish?: boolean;
}

export default function LocationItem({ location, isFinish = false }: LocationItemProps) {
  return (
    <div className="location-item mb-3 last:mb-0">
      <div className="flex items-start">
        <div className={`${isFinish ? 'bg-primary' : 'bg-secondary'} text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1`}>
          {isFinish ? (
            <FlagCheckered className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex justify-between">
            <span className="font-semibold text-neutral-900">{location.name}</span>
            <span className="font-mono text-neutral-700">{location.estimatedTime}</span>
          </div>
          <p className="text-sm text-neutral-600">
            {location.kilometer.toFixed(1)} km
            {location.description && ` - ${location.description}`}
          </p>
        </div>
      </div>
    </div>
  );
}
