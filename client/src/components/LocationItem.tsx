import { MapPin, Flag, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { type LocationTime } from "@shared/schema";
import DirectionsButton from "./DirectionsButton";
import { formatTimeDifference } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationItemProps {
  location: LocationTime;
  isFinish?: boolean;
  expectedTime?: string; // Expected time from original prediction
}

export default function LocationItem({ location, isFinish = false, expectedTime }: LocationItemProps) {
  const { t, language } = useLanguage();
  
  // Calculate time difference if expected time is provided
  const timeDiff = expectedTime && location.estimatedTime 
    ? formatTimeDifference(expectedTime, location.estimatedTime)
    : null;
    
  // Handle location description translation for Rotterdam
  // Only needed for locations that have been manually translated
  const getLocalizedDescription = () => {
    if (!location.description) return "";
    
    // Special case for Rotterdam landmarks that have been translated
    if (language === "en") {
      // For English, map the Dutch descriptions back to English
      switch (location.description) {
        case "Het startgebied van de marathon nabij het Stadhuis Rotterdam":
          return "The starting area of the marathon near Rotterdam City Hall";
        case "Eerste metrohalte, makkelijk te bereiken en dicht bij de start":
          return "First metro stop, easy to reach and close to the start";
        case "Het halverwege punt met timing matten en fotografen":
          return "The halfway point with timing mats and photographers";
        case "Schreeuw de lopers de Erasmusbrug over!":
          return "Shout to the runners across the Erasmus Bridge!";
        case "Laatste timing punt voor de finish, lopers geven hun laatste krachten":
          return "Last timing point before the finish, runners are giving their final push";
        case "Spannend finishgebied met tribunes":
          return "Exciting finish area with grandstands";
        default:
          return location.description;
      }
    }
    
    return location.description;
  };

  return (
    <div className="location-item p-2 sm:p-3 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all duration-200 bg-white">
      <div className="flex items-start">
        <div className={`${isFinish ? 'bg-primary' : 'bg-secondary'} text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-sm`}>
          {isFinish ? (
            <Flag className="h-5 w-5" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
        </div>
        <div className="ml-2 sm:ml-4 flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="font-semibold text-neutral-900 text-lg">{location.name}</span>
            <span className="font-mono text-primary font-medium sm:text-right mt-1 sm:mt-0">
              {location.estimatedTime}
            </span>
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            <span className="bg-neutral-100 px-2 py-0.5 rounded-md inline-block mr-2">
              {location.kilometer.toFixed(1)} km
            </span>
            {location.description && getLocalizedDescription()}
          </p>
          
          {/* Time difference indicator */}
          {timeDiff && (
            <div className={`mt-2 text-sm flex items-center ${
              timeDiff.trend === 'ahead' 
                ? 'text-green-600' 
                : timeDiff.trend === 'behind' 
                  ? 'text-orange-600' 
                  : 'text-blue-600'
            }`}>
              {timeDiff.trend === 'ahead' ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>{t("timeComparison.ahead")} {timeDiff.difference}</span>
                </>
              ) : timeDiff.trend === 'behind' ? (
                <>
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>{t("timeComparison.behind")} {timeDiff.difference}</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{t("timeComparison.onTime")}</span>
                </>
              )}
            </div>
          )}
          
          <div className="mt-3 flex">
            <DirectionsButton 
              latitude={location.latitude} 
              longitude={location.longitude}
              locationName={location.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
