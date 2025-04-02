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
});

export const insertMarathonLocationSchema = createInsertSchema(marathonLocations).pick({
  name: true,
  kilometer: true,
  description: true,
});

// Schema for runner data input
export const runnerInputSchema = z.object({
  wave: z.enum(["1", "2", "3", "4"]),
  pace: z.string().regex(/^\d+:\d{2}$/, "Pace must be in format mm:ss"),
  runnerName: z.string().optional(),
});

// Schema for calculated location times
export const locationTimeSchema = z.object({
  name: z.string(),
  kilometer: z.number(),
  description: z.string().optional(),
  estimatedTime: z.string(),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMarathonLocation = z.infer<typeof insertMarathonLocationSchema>;
export type MarathonLocation = typeof marathonLocations.$inferSelect;

export type RunnerInput = z.infer<typeof runnerInputSchema>;
export type LocationTime = z.infer<typeof locationTimeSchema>;

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

// Default viewing locations
export const defaultViewingLocations = [
  { name: "Erasmus Bridge", kilometer: 10.5, description: "Excellent viewing spot with good access from public transport" },
  { name: "Coolsingel", kilometer: 21.1, description: "Half marathon point with lots of crowd support" },
  { name: "Kralingse Bos", kilometer: 30, description: "Beautiful park setting when runners need extra support" },
  { name: "Finish Line - Coolsingel", kilometer: 42.195, description: "Celebrate at the finish! Get there early for a good spot." }
];
