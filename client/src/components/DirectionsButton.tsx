import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import InteractiveMap from "./InteractiveMap";
import { useLanguage } from "@/contexts/LanguageContext";

interface DirectionsButtonProps {
  latitude: number | null;
  longitude: number | null;
  locationName: string;
}

export default function DirectionsButton({ latitude, longitude, locationName }: DirectionsButtonProps) {
  const { t } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  
  // If latitude or longitude is missing, don't render the button
  if (!latitude || !longitude) {
    return null;
  }

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking&dir_action=navigate`;
  };

  const handleClick = () => {
    setShowMap(true);
  };

  const handleClose = () => {
    setShowMap(false);
  };

  const openGoogleMaps = () => {
    window.open(getDirectionsUrl(), '_blank');
  };

  return (
    <>
      <div className="flex mt-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleClick}
        >
          <MapIcon className="h-4 w-4" />
          <span>{t("directions.viewOnMap")}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={openGoogleMaps}
        >
          <MapIcon className="h-4 w-4" />
          <span>{t("directions.getDirections")}</span>
        </Button>
      </div>

      {showMap && (
        <InteractiveMap
          centerLatitude={latitude}
          centerLongitude={longitude}
          isOpen={showMap}
          onClose={handleClose}
          showRoute={true}
        />
      )}
    </>
  );
}