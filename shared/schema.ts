import { z } from "zod";

// Schema for runner data input
export const runnerInputSchema = z.object({
  wave: z.string(), // Changed to string to allow for any wave value from configuration
  pace: z.string().optional(),
  finishTime: z.string().optional(),
  runnerName: z.string().optional(),
  id: z.string().optional(), // Add unique ID for multiple runners
}).refine(data => {
  // Either pace or finish time must be provided and not empty
  return (data.pace && data.pace.trim() !== '') || (data.finishTime && data.finishTime.trim() !== '');
}, {
  message: "Either pace or finish time must be provided",
  path: ["pace"] // highlight the pace field if both are missing
});

// Schema for runner's predictions result
export const runnerPredictionSchema = z.object({
  runner: z.object({
    id: z.string(),
    name: z.string(),
    wave: z.string(),
    pace: z.string(),
  }),
  locationTimes: z.array(z.object({
    name: z.string(),
    kilometer: z.number(),
    description: z.string().nullable(),
    estimatedTime: z.string(),
    mapPositionX: z.number().nullable(),
    mapPositionY: z.number().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  })),
  currentLocation: z.object({
    distance: z.number(),
    elapsedTime: z.string(),
    estimatedFinish: z.string(),
  }),
});

// Schema for calculated location times
export const locationTimeSchema = z.object({
  name: z.string(),
  kilometer: z.number(),
  description: z.string().nullable(), // Changed to nullable to fix type issues
  estimatedTime: z.string(),
  mapPositionX: z.number().nullable(),
  mapPositionY: z.number().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

// Type definitions
export type RunnerInput = z.infer<typeof runnerInputSchema>;
export type LocationTime = z.infer<typeof locationTimeSchema>;
export type RunnerPredictionResult = z.infer<typeof runnerPredictionSchema>;
