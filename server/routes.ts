import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Courses
  app.get(api.courses.list.path, async (_req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.courses.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const course = await storage.getCourse(id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const videos = await storage.getVideosByCourseId(id);
    const notes = await storage.getNotesByCourseId(id);

    res.json({ ...course, videos, notes });
  });

  // Progress
  app.get(api.progress.list.path, async (_req, res) => {
    // For this simple app, we mock a single user ID = 1
    const userId = 1; 
    const progress = await storage.getProgress(userId);
    res.json(progress);
  });

  app.post(api.progress.update.path, async (req, res) => {
    try {
      const input = api.progress.update.input.parse(req.body);
      const updated = await storage.updateProgress(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
