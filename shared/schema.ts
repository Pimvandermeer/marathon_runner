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
});

export const insertMarathonLocationSchema = createInsertSchema(marathonLocations).pick({
  name: true,
  kilometer: true,
  description: true,
  mapPositionX: true,
  mapPositionY: true,
});

// Schema for runner data input
export const runnerInputSchema = z.object({
  wave: z.enum(["1", "2", "3", "4"]),
  pace: z.string().regex(/^\d+:\d{2}$/, "Pace must be in format mm:ss"),
  runnerName: z.string().optional(),
  id: z.string().optional(), // Add unique ID for multiple runners
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
  "2": "10:15",
  "3": "10:30",
  "4": "10:45"
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

// Default viewing locations with map positioning coordinates
export const defaultViewingLocations = [
  { name: "Start - Coolsingel", kilometer: 0, description: "The starting point on Coolsingel", mapPositionX: 50, mapPositionY: 60 },
  { name: "Willemsbridge", kilometer: 5, description: "Good viewing spot near Willemsbridge with easy access", mapPositionX: 82, mapPositionY: 62 },
  { name: "Erasmus Bridge", kilometer: 10.5, description: "Iconic bridge with excellent views and access from public transport", mapPositionX: 63, mapPositionY: 48 },
  { name: "Nieuwe Maas River", kilometer: 15, description: "Scenic route along the river with good vantage points", mapPositionX: 75, mapPositionY: 82 },
  { name: "Half Marathon Point", kilometer: 21.1, description: "Half marathon point with lots of crowd support", mapPositionX: 29, mapPositionY: 85 },
  { name: "Stadion Feijenoord", kilometer: 25, description: "Near the stadium with plenty of viewing space", mapPositionX: 71, mapPositionY: 85 },
  { name: "Kralingse Plas", kilometer: 30, description: "Beautiful lake area with open spaces for viewing", mapPositionX: 81, mapPositionY: 27 },
  { name: "Boszoom", kilometer: 35, description: "Good spot with direct access from metro stations", mapPositionX: 76, mapPositionY: 37 },
  { name: "Blaak Metro Station", kilometer: 37.5, description: "Urban area with good transport connections", mapPositionX: 50, mapPositionY: 45 },
  { name: "Westersingel", kilometer: 40, description: "Final stretch approaching the finish line", mapPositionX: 41, mapPositionY: 55 },
  { name: "Finish Line - Coolsingel", kilometer: 42.195, description: "Celebrate at the finish! Get there early for a good spot.", mapPositionX: 48, mapPositionY: 60 }
];
