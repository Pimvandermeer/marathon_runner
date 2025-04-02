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

// Utility function to add time to a base time
function addTime(baseTime: string, minutesToAdd: number): string {
  const [hours, minutes] = baseTime.split(":").map(Number);
  
  let totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = Math.floor(totalMinutes % 60);
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

// Utility function to format elapsed time in HH:MM:SS
function formatElapsedTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  const seconds = Math.floor((minutes * 60) % 60);
  
  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    
    // Simulate current race time based on the current time
    // For demo purposes, we'll calculate a position based on the current time of day
    // This creates a more realistic simulation of a runner's position
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Determine a position in the race based on the current time (simulated)
    // We'll scale this to be between 0 and 42.195 km
    let currentDistance;
    
    // Simulate based on time of day (for demo purposes)
    if (currentHour >= 12) {
      // Afternoon: Runner is likely past halfway point
      currentDistance = Math.min(42.195, 20 + (currentMinute / 60) * 22);
    } else if (currentHour >= 10) {
      // Late morning: Runner is in first half
      currentDistance = Math.min(42.195, (currentMinute / 60) * 20);
    } else {
      // Early morning or default: Runner hasn't started yet
      currentDistance = 0;
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
