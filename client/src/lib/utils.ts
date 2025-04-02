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

// Format time for display (HH:MM)
export function formatTime(time: string): string {
  if (!time) return "";
  return time;
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
  
  // If there's no colon and the length is 2 or more, add a colon
  if (colonCount === 0 && formatted.length >= 2) {
    formatted = formatted.substring(0, formatted.length - 2) + 
      ':' + formatted.substring(formatted.length - 2);
  }
  
  return formatted;
}
