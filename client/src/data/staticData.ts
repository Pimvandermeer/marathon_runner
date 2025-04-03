import { LocationTime, RunnerInput } from '@shared/schema';
import { getWaveStartTimes, getViewingLocations } from '@/data/marathonConfig';

// Utility function to convert pace (mm:ss) to minutes
function paceToMinutes(pace: string): number {
  // Handle empty input
  if (!pace || pace.trim() === '') {
    return 0;
  }
  
  // Handle different formats
  if (pace.includes(':')) {
    const parts = pace.split(':');
    const minutes = parseInt(parts[0] || '0', 10);
    const seconds = parseInt(parts[1] || '0', 10);
    return minutes + seconds / 60;
  } else {
    // Try to parse as just minutes
    return parseInt(pace, 10) || 0;
  }
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

// Get marathon locations from the configuration
export function getMarathonLocations() {
  return getViewingLocations().map((location, index) => ({
    id: index + 1,
    name: location.name,
    kilometer: location.kilometer,
    description: location.description || null,
    mapPositionX: location.mapPositionX,
    mapPositionY: location.mapPositionY,
    latitude: location.latitude,
    longitude: location.longitude
  }));
}

// Function to calculate pace from target finish time
function calculatePaceFromFinishTime(wave: string, finishTime: string): string {
  // Handle empty input
  if (!finishTime || finishTime.trim() === '') {
    return "0:00";
  }

  console.log("Calculating pace from finish time:", finishTime);
  
  const waveStartTimes = getWaveStartTimes();
  const startTime = waveStartTimes[wave];
  
  // Parse finish and start times
  let totalFinishMinutes = 0;
  
  // Handle different formats (with or without colon)
  if (finishTime.includes(':')) {
    const parts = finishTime.split(':');
    const hours = parseInt(parts[0] || '0', 10);
    const minutes = parseInt(parts[1] || '0', 10);
    totalFinishMinutes = hours * 60 + minutes;
  } else {
    // Try to parse as number of minutes
    totalFinishMinutes = parseInt(finishTime, 10) || 0;
  }
  
  // For finish time input, we're not calculating from start time, but total race time
  // A marathon is 42.195 km, so we need to divide the total minutes by that distance
  
  console.log("Total finish minutes:", totalFinishMinutes);
  
  // Calculate pace (minutes per km)
  const paceMinutes = totalFinishMinutes / 42.195;
  
  console.log("Calculated pace minutes:", paceMinutes);
  
  // Format to mm:ss
  const mins = Math.floor(paceMinutes);
  const secs = Math.round((paceMinutes - mins) * 60);
  
  const result = `${mins}:${secs.toString().padStart(2, '0')}`;
  console.log("Formatted pace result:", result);
  
  return result;
}

// Function to calculate runner predictions (static version of the backend function)
export function calculateRunnerPredictions(runnerInput: RunnerInput) {
  const { wave, pace, finishTime, runnerName, id } = runnerInput;
  
  // Make sure we have a wave selected
  if (!wave) {
    throw new Error("Wave must be selected");
  }

  console.log("Inputs:", { wave, pace, finishTime });

  // Determine pace - either use provided pace or calculate from finish time
  let effectivePace = "5:30"; // Default pace as fallback (reasonable marathon pace)
  
  if (pace && pace.trim() !== '') {
    effectivePace = pace;
  } else if (finishTime && finishTime.trim() !== '') {
    effectivePace = calculatePaceFromFinishTime(wave, finishTime);
  }
  
  console.log("Effective pace:", effectivePace);
  
  const paceInMinutes = paceToMinutes(effectivePace);
  
  // Catch unreasonable pace values
  if (paceInMinutes <= 0 || paceInMinutes > 15) { // No one runs slower than 15 min/km in a marathon
    throw new Error("Invalid pace value. Please enter a valid pace or finish time.");
  }
  
  const waveStartTimes = getWaveStartTimes();
  const startTime = waveStartTimes[wave];
  
  // Create a unique ID if one wasn't provided
  const runnerId = id || `runner-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Calculate location times
  const locations = getMarathonLocations();
  const locationTimes: LocationTime[] = locations.map((location: any) => {
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
  
  // Simulate race day scenario based on marathon configuration
  // Get the current marathon configuration
  const currentDate = new Date();
  
  // Extract hours and minutes from the current date
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  
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
      pace: effectivePace
    }
  };
}

// Function to get all marathon locations
export function getAllMarathonLocations() {
  return getViewingLocations();
}