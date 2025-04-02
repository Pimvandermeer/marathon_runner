import { LocationTime, RunnerInput, waveStartTimes, defaultViewingLocations } from '@shared/schema';

// Utility function to convert pace (mm:ss) to minutes
function paceToMinutes(pace: string): number {
  const [minutes, seconds] = pace.split(':').map(Number);
  return minutes + seconds / 60;
}

// Add time to a base time
function addTime(baseTime: string, minutesToAdd: number): string {
  const [hours, minutes] = baseTime.split(':').map(Number);
  
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = Math.floor(totalMinutes % 60).toString().padStart(2, '0');
  
  return `${newHours}:${newMinutes}`;
}

// Format elapsed time in a natural format (Xh Ym Zs)
function formatElapsedTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  const seconds = Math.floor((minutes * 60) % 60);
  
  // For display in timeline, use a more readable format
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m ${seconds}s`;
  } else if (remainingMinutes > 0) {
    return `${remainingMinutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Static data for marathon locations
export const marathonLocations = defaultViewingLocations.map((location: any, index: number) => ({
  id: index + 1,
  name: location.name,
  kilometer: location.kilometer,
  description: location.description || null,
  mapPositionX: location.mapPositionX,
  mapPositionY: location.mapPositionY,
  latitude: location.latitude,
  longitude: location.longitude
}));

// Function to calculate runner predictions (static version of the backend function)
export function calculateRunnerPredictions(runnerInput: RunnerInput) {
  const { wave, pace, runnerName, id } = runnerInput;
  const paceInMinutes = paceToMinutes(pace);
  const startTime = waveStartTimes[wave];
  
  // Create a unique ID if one wasn't provided
  const runnerId = id || `runner-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Calculate location times
  const locationTimes: LocationTime[] = marathonLocations.map((location: any) => {
    const timeToReachInMinutes = location.kilometer * paceInMinutes;
    const estimatedTime = addTime(startTime, timeToReachInMinutes);
    
    return {
      name: location.name,
      kilometer: location.kilometer,
      description: location.description,
      estimatedTime,
      mapPositionX: location.mapPositionX,
      mapPositionY: location.mapPositionY,
      latitude: location.latitude,
      longitude: location.longitude
    };
  });
  
  // Simulate race day scenario - April 13, 2025
  // Create a simulated marathon race day with the current time of day
  const marathonDate = new Date('2025-04-13T00:00:00');
  const now = new Date();
  
  // Set marathon date to have the same time of day as now
  marathonDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
  
  // Extract hours and minutes from the marathon date
  const currentHour = marathonDate.getHours();
  const currentMinute = marathonDate.getMinutes();
  
  // Parse the user's start time
  const [startHour, startMinute] = startTime.split(":").map(Number);
  
  // Determine a position in the race based on elapsed time since wave start (simulated)
  let currentDistance;
  
  // Calculate minutes elapsed since the wave start time
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const startTotalMinutes = startHour * 60 + startMinute;
  const elapsedMinutesSinceStart = Math.max(0, currentTotalMinutes - startTotalMinutes);
  
  // If the race hasn't started yet for this wave, set distance to 0
  if (elapsedMinutesSinceStart <= 0) {
    currentDistance = 0;
  } else {
    // Calculate how far they would have run based on their pace
    currentDistance = Math.min(42.195, (elapsedMinutesSinceStart / paceInMinutes));
  }
  
  // Calculate times based on the current position
  const elapsedTimeMinutes = currentDistance * paceInMinutes;
  const elapsedTime = formatElapsedTime(elapsedTimeMinutes);
  const estimatedFinishMinutes = 42.195 * paceInMinutes;
  const estimatedFinish = addTime(startTime, estimatedFinishMinutes);
  
  return {
    locationTimes,
    currentLocation: {
      distance: currentDistance,
      elapsedTime,
      estimatedFinish
    },
    runner: {
      id: runnerId,
      name: runnerName || "Runner",
      wave,
      pace
    }
  };
}

// Function to get all marathon locations
export function getAllMarathonLocations() {
  return marathonLocations;
}