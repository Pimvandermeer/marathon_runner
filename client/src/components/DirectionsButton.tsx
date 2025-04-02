import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

interface DirectionsButtonProps {
  latitude: number | null;
  longitude: number | null;
  locationName: string;
}

export default function DirectionsButton({ latitude, longitude, locationName }: DirectionsButtonProps) {
  // If latitude or longitude is missing, don't render the button
  if (!latitude || !longitude) {
    return null;
  }

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking&dir_action=navigate`;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1 mt-2"
      onClick={() => window.open(getDirectionsUrl(), '_blank')}
    >
      <MapIcon className="h-4 w-4" />
      <span>Get Directions</span>
    </Button>
  );
}