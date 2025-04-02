import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { runnerInputSchema, locationTimeSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  app.get("/api/marathon-locations", async (req: Request, res: Response) => {
    try {
      const locations = await storage.getAllMarathonLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve marathon locations" });
    }
  });

  // Calculate runner predictions
  app.post("/api/calculate-predictions", async (req: Request, res: Response) => {
    try {
      const validationResult = runnerInputSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const predictions = await storage.calculateRunnerPredictions(validationResult.data);
      res.json(predictions);
    } catch (error) {
      console.error("Error calculating predictions:", error);
      res.status(500).json({ message: "Failed to calculate runner predictions" });
    }
  });

  // Parse and upload CSV data (if we had csv parsing functionality)
  app.post("/api/upload-csv", async (req: Request, res: Response) => {
    // In a real implementation, this would parse the CSV data
    // For this exercise, we'll return a success message
    res.json({ message: "CSV data processed successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
