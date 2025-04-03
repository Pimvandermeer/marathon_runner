import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Marathon data schema
export const marathonLocations = pgTable("marathon_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  kilometer: doublePrecision("kilometer").notNull(),
  description: text("description"),
  mapPositionX: doublePrecision("map_position_x"),
  mapPositionY: doublePrecision("map_position_y"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const insertMarathonLocationSchema = createInsertSchema(marathonLocations).pick({
  name: true,
  kilometer: true,
  description: true,
  mapPositionX: true,
  mapPositionY: true,
  latitude: true,
  longitude: true,
});

// Schema for runner data input
export const runnerInputSchema = z.object({
  wave: z.enum(["1", "2", "3", "4"]),
  pace: z.string().regex(/^\d+:\d{2}$/, "Pace must be in format mm:ss").optional(),
  finishTime: z.string().regex(/^\d{1,2}:\d{2}$/, "Finish time must be in format hh:mm").optional(),
  runnerName: z.string().optional(),
  id: z.string().optional(), // Add unique ID for multiple runners
}).refine(data => data.pace || data.finishTime, {
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
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMarathonLocation = z.infer<typeof insertMarathonLocationSchema>;
export type MarathonLocation = typeof marathonLocations.$inferSelect;

export type RunnerInput = z.infer<typeof runnerInputSchema>;
export type LocationTime = z.infer<typeof locationTimeSchema>;
export type RunnerPredictionResult = z.infer<typeof runnerPredictionSchema>;

// Wave start times (in 24-hour format)
export const waveStartTimes = {
  "1": "10:00",
  "2": "10:07",
  "3": "10:14",
  "4": "10:21"
};

// Key landmarks for the timeline
export const marathonLandmarks = [
  { distance: 0, name: "Start" },
  { distance: 10, name: "Erasmus Bridge" },
  { distance: 21.1, name: "Half Marathon" },
  { distance: 30, name: "Kralingse Bos" },
  { distance: 36, name: "City Center" },
  { distance: 42.195, name: "Finish" }
];

// Default viewing locations with map positioning coordinates and geo coordinates for actual mapping
export const defaultViewingLocations = [
  { 
    name: "Start - Coolsingel", 
    kilometer: 0, 
    description: "The starting point on Coolsingel", 
    mapPositionX: 49, 
    mapPositionY: 41, 
    latitude: 51.9217, 
    longitude: 4.4777
  },
  { 
    name: "Willemsbrug", 
    kilometer: 5, 
    description: "Good viewing spot near Willemsbrug with easy access", 
    mapPositionX: 75, 
    mapPositionY: 45, 
    latitude: 51.9170, 
    longitude: 4.5020
  },
  { 
    name: "Erasmus Bridge", 
    kilometer: 10.5, 
    description: "Iconic bridge with excellent views and access from public transport", 
    mapPositionX: 38, 
    mapPositionY: 55, 
    latitude: 51.9089, 
    longitude: 4.4830
  },
  { 
    name: "Nieuwe Maas River", 
    kilometer: 15, 
    description: "Scenic route along the river with good vantage points", 
    mapPositionX: 30, 
    mapPositionY: 75, 
    latitude: 51.8997, 
    longitude: 4.5130
  },
  { 
    name: "Half Marathon Point", 
    kilometer: 21.1, 
    description: "Half marathon point with lots of crowd support", 
    mapPositionX: 50, 
    mapPositionY: 85, 
    latitude: 51.8927, 
    longitude: 4.5396
  },
  { 
    name: "Stadion Feijenoord", 
    kilometer: 25, 
    description: "Near the stadium with plenty of viewing space", 
    mapPositionX: 71, 
    mapPositionY: 80, 
    latitude: 51.8946, 
    longitude: 4.5232
  },
  { 
    name: "Kralingse Plas", 
    kilometer: 30, 
    description: "Beautiful lake area with open spaces for viewing", 
    mapPositionX: 83, 
    mapPositionY: 25, 
    latitude: 51.9301, 
    longitude: 4.5373
  },
  { 
    name: "Boszoom", 
    kilometer: 35, 
    description: "Good spot with direct access from metro stations", 
    mapPositionX: 73, 
    mapPositionY: 33, 
    latitude: 51.9241, 
    longitude: 4.5282
  },
  { 
    name: "Blaak", 
    kilometer: 37.5, 
    description: "Urban area with good transport connections", 
    mapPositionX: 54, 
    mapPositionY: 45, 
    latitude: 51.9195, 
    longitude: 4.4920
  },
  { 
    name: "Westersingel", 
    kilometer: 40, 
    description: "Final stretch approaching the finish line", 
    mapPositionX: 43, 
    mapPositionY: 39, 
    latitude: 51.9177, 
    longitude: 4.4767
  },
  { 
    name: "Finish Line - Coolsingel", 
    kilometer: 42.195, 
    description: "Celebrate at the finish! Get there early for a good spot.", 
    mapPositionX: 49, 
    mapPositionY: 41, 
    latitude: 51.9217, 
    longitude: 4.4777
  }
];
