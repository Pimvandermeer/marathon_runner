import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import GPXParser from 'gpxparser';
import { getCurrentMarathon } from '@/data/marathonConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InteractiveMapProps {
  centerLatitude?: number;
  centerLongitude?: number;
  isOpen: boolean;
  onClose: () => void;
  showRoute?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 51.9244, // Rotterdam city center
  lng: 4.4777,
};

const googleMapsApiKey = ''; // We'll use this without an API key for development, but will need one for production

export default function InteractiveMap({
  centerLatitude, 
  centerLongitude,
  isOpen,
  onClose,
  showRoute = true
}: InteractiveMapProps) {
  const { t } = useLanguage();
  const marathon = getCurrentMarathon();
  const [gpxData, setGpxData] = useState<{ lat: number; lng: number }[]>([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
  });

  useEffect(() => {
    if (centerLatitude && centerLongitude) {
      setMapCenter({
        lat: centerLatitude,
        lng: centerLongitude,
      });
    }
  }, [centerLatitude, centerLongitude]);

  const loadGpxFile = useCallback(async () => {
    if (!marathon.gpxRoute || !showRoute) {
      return;
    }

    try {
      const response = await fetch(marathon.gpxRoute);
      if (!response.ok) {
        console.error('Failed to load GPX file');
        return;
      }

      const gpxContent = await response.text();
      const gpx = new GPXParser();
      gpx.parse(gpxContent);

      if (gpx.tracks.length > 0 && gpx.tracks[0].points.length > 0) {
        const points = gpx.tracks[0].points.map((point: any) => ({
          lat: point.lat,
          lng: point.lon,
        }));
        setGpxData(points);

        // Center the map on the starting point if no specific center is provided
        if (!centerLatitude && !centerLongitude) {
          setMapCenter({
            lat: points[0].lat,
            lng: points[0].lng,
          });
        }
      }
    } catch (error) {
      console.error('Error loading GPX file:', error);
    }
  }, [marathon.gpxRoute, showRoute, centerLatitude, centerLongitude]);

  useEffect(() => {
    if (isLoaded && isOpen && !mapLoaded) {
      loadGpxFile();
      setMapLoaded(true);
    }
  }, [isLoaded, isOpen, mapLoaded, loadGpxFile]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-lg shadow-xl">
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0 bg-white hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="w-full h-full rounded-lg overflow-hidden">
          {loadError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
              <div className="text-red-500 mb-4">
                {googleMapsApiKey 
                  ? 'Error loading Google Maps. Please try again later.' 
                  : 'Google Maps API key is required for full map functionality.'}
              </div>
              <div className="text-center max-w-md">
                <p className="mb-4">You can still use Google Maps for directions by clicking the "Get Directions" button.</p>
                <Button 
                  variant="outline"
                  className="mt-2"
                  onClick={onClose}
                >
                  {t("directions.close")}
                </Button>
              </div>
            </div>
          ) : isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={14}
              options={{
                mapTypeControl: true,
                streetViewControl: false,
              }}
            >
              {/* Marathon route as polyline */}
              {gpxData.length > 0 && (
                <Polyline
                  path={gpxData}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  }}
                />
              )}

              {/* Marker for specified location */}
              {centerLatitude && centerLongitude && (
                <Marker
                  position={{
                    lat: centerLatitude,
                    lng: centerLongitude,
                  }}
                />
              )}

              {/* Show markers for all viewing locations */}
              {marathon.viewingLocations.map((location, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  title={`${location.name} (${location.kilometer} km)`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}