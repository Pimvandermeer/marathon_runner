import { 
  users, 
  type User, 
  type InsertUser, 
  type MarathonLocation,
  type InsertMarathonLocation,
  type RunnerInput,
  type LocationTime,
  defaultViewingLocations,
  waveStartTimes
} from "@shared/schema";

// Utility function to convert pace string (mm:ss) to minutes
function paceToMinutes(pace: string): number {
  const [minutes, seconds] = pace.split(":").map(Number);
  return minutes + (seconds / 60);
}

// Utility function to add time to a base time with Rotterdam timezone (UTC+2 for summer time)
function addTime(baseTime: string, minutesToAdd: number): string {
  // Create a date object set to April 13, 2025 (Rotterdam Marathon date)
  const marathonDate = new Date('2025-04-13T00:00:00');
  const [baseHours, baseMinutes] = baseTime.split(":").map(Number);
  
  // Set the time to the base time
  marathonDate.setHours(baseHours, baseMinutes, 0, 0);
  
  // Add the minutes
  marathonDate.setMinutes(marathonDate.getMinutes() + minutesToAdd);
  
  // Format the time in 24-hour format
  const newHours = marathonDate.getHours().toString().padStart(2, '0');
  const newMinutes = marathonDate.getMinutes().toString().padStart(2, '0');
  
  return `${newHours}:${newMinutes}`;
}

// Utility function to format elapsed time in a natural format (Xh Ym Zs)
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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Marathon location methods
  getAllMarathonLocations(): Promise<MarathonLocation[]>;
  createMarathonLocation(location: InsertMarathonLocation): Promise<MarathonLocation>;
  
  // Runner prediction methods
  calculateRunnerPredictions(runnerInput: RunnerInput): Promise<{
    locationTimes: LocationTime[],
    currentLocation: { distance: number, elapsedTime: string, estimatedFinish: string }
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private marathonLocations: MarathonLocation[];
  currentId: number;
  locationId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.locationId = 1;
    
    // Initialize with default viewing locations
    this.marathonLocations = defaultViewingLocations.map(location => ({
      id: this.locationId++,
      name: location.name,
      kilometer: location.kilometer,
      description: location.description || null,
      mapPositionX: location.mapPositionX,
      mapPositionY: location.mapPositionY,
      latitude: location.latitude,
      longitude: location.longitude
    }));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllMarathonLocations(): Promise<MarathonLocation[]> {
    return [...this.marathonLocations];
  }
  
  async createMarathonLocation(location: InsertMarathonLocation): Promise<MarathonLocation> {
    const id = this.locationId++;
    const newLocation: MarathonLocation = { 
      id,
      name: location.name,
      kilometer: location.kilometer,
      description: location.description || null,
      mapPositionX: location.mapPositionX || null,
      mapPositionY: location.mapPositionY || null,
      latitude: location.latitude || null,
      longitude: location.longitude || null
    };
    this.marathonLocations.push(newLocation);
    return newLocation;
  }
  
  async calculateRunnerPredictions(runnerInput: RunnerInput): Promise<{
    locationTimes: LocationTime[],
    currentLocation: { distance: number, elapsedTime: string, estimatedFinish: string },
    runner: { id: string, name: string, wave: string, pace: string }
  }> {
    const { wave, pace, runnerName, id } = runnerInput;
    const paceInMinutes = paceToMinutes(pace);
    const startTime = waveStartTimes[wave];
    
    // Create a unique ID if one wasn't provided
    const runnerId = id || `runner-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Calculate location times
    const locationTimes: LocationTime[] = this.marathonLocations.map(location => {
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
    // We'll scale this to be between 0 and 42.195 km
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
      // This ensures the distance is tied to both the current time and the runner's pace
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
}

export const storage = new MemStorage();
