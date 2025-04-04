import { LocationTime } from '@shared/schema';

// Define the Marathon Configuration type
export interface MarathonConfig {
  id: string;
  name: string;
  year: string;
  date: string;
  logo: string;
  routeMap: string;
  description: string;
  websiteUrl: string;
  cityInfo: {
    country: string;
    transportInfo: string;
    timezone: string;
  };
  waveStartTimes: Record<string, string>;
  marathonLandmarks: Array<{
    distance: number;
    name: string;
  }>;
  viewingLocations: Array<{
    name: string;
    kilometer: number;
    description: string;
    mapPositionX: number;
    mapPositionY: number;
    latitude: number;
    longitude: number;
  }>;
  spectatorTips: string[] | {
    en: string[];
    nl: string[];
  };
}

// Import the marathon configurations
import rotterdamConfig from './marathons/rotterdam.json';
// Amsterdam marathon will be added in the future
// import amsterdamConfig from './marathons/amsterdam.json';

// List of available marathons (only Rotterdam for now)
export const availableMarathons: MarathonConfig[] = [
  rotterdamConfig as MarathonConfig
];

// Default marathon
const defaultMarathonId = 'rotterdam';

// Get the currently selected marathon from localStorage or use default
export function getCurrentMarathon(): MarathonConfig {
  const savedMarathonId = localStorage.getItem('selectedMarathon') || defaultMarathonId;
  
  const marathon = availableMarathons.find(m => m.id === savedMarathonId);
  return marathon || availableMarathons[0];
}

// Save the selected marathon to localStorage
export function setCurrentMarathon(marathonId: string): void {
  localStorage.setItem('selectedMarathon', marathonId);
}

// Get viewing locations for current marathon
export function getViewingLocations(): LocationTime[] {
  const marathon = getCurrentMarathon();
  
  return marathon.viewingLocations.map(location => ({
    name: location.name,
    kilometer: location.kilometer,
    description: location.description,
    estimatedTime: '', // This will be calculated based on runner data
    mapPositionX: location.mapPositionX,
    mapPositionY: location.mapPositionY,
    latitude: location.latitude,
    longitude: location.longitude
  }));
}

// Get wave start times for current marathon
export function getWaveStartTimes(): Record<string, string> {
  return getCurrentMarathon().waveStartTimes;
}

// Get landmarks for current marathon
export function getMarathonLandmarks(): Array<{ distance: number; name: string }> {
  return getCurrentMarathon().marathonLandmarks;
}

// Get spectator tips for current marathon in the specified language
export function getSpectatorTips(language: string = 'en'): string[] {
  const tips = getCurrentMarathon().spectatorTips;
  
  // Check if tips are language-specific (use type guard)
  if (Array.isArray(tips)) {
    // Tips are just a simple array, return as is
    return tips;
  } else {
    // Tips are language-specific, return for the selected language or fallback to English
    const languageKey = language as keyof typeof tips;
    return tips[languageKey] || tips.en;
  }
}