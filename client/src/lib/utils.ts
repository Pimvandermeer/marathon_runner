import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to parse pace string (mm:ss) to minutes
export function paceToMinutes(pace: string): number {
  const [minutes, seconds] = pace.split(":").map(Number);
  return minutes + (seconds / 60);
}

// Format pace string for display
export function formatPace(pace: string): string {
  if (!pace) return "";
  
  // Ensure format is mm:ss
  const [minutes, seconds] = pace.split(":").map(Number);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Calculate percentage position along timeline based on distance
export function getPercentagePosition(distance: number, totalDistance: number = 42.195): number {
  return (distance / totalDistance) * 100;
}

// Format time for display (convert 24h to 12h with AM/PM)
export function formatTime(time: string): string {
  if (!time) return "";
  
  // Parse the time (expected format is HH:MM or HH:MM:SS)
  const parts = time.split(':');
  if (parts.length < 2) return time;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  
  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${hours12}:${minutes} ${period}`;
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (Number.isInteger(distance)) {
    return `${distance} km`;
  }
  return `${distance.toFixed(1)} km`;
}

// Validate pace input
export function validatePaceInput(input: string): boolean {
  // Allow empty input during typing
  if (!input) return true;
  
  // Check if matches mm:ss format
  const regex = /^(\d+):([0-5][0-9])$/;
  return regex.test(input);
}

// Format a pace input string as the user types
export function formatPaceInput(input: string): string {
  // Remove non-numeric and non-colon characters
  let formatted = input.replace(/[^0-9:]/g, '');
  
  // Only allow one colon
  const colonCount = (formatted.match(/:/g) || []).length;
  if (colonCount > 1) {
    formatted = formatted.substring(0, formatted.lastIndexOf(':')) + 
      formatted.substring(formatted.lastIndexOf(':') + 1);
  }
  
  // If there are at least 2 digits and no colon, add a colon after the first digit
  if (colonCount === 0 && formatted.length >= 2) {
    formatted = formatted.substring(0, 1) + 
      ':' + formatted.substring(1);
  }
  
  // Ensure we have valid minutes:seconds format
  if (colonCount === 1) {
    const [minutes, seconds] = formatted.split(':');
    
    // If seconds part is more than 2 digits, truncate to 2
    if (seconds && seconds.length > 2) {
      formatted = `${minutes}:${seconds.substring(0, 2)}`;
    }
    
    // Add leading zero to seconds if needed
    if (seconds && seconds.length === 1) {
      formatted = `${minutes}:${seconds.padStart(2, '0')}`;
    }
  }
  
  return formatted;
}
