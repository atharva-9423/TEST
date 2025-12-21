import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["SPPU", "Autonomy"] }).notNull(), // Mode
  thumbnailUrl: text("thumbnail_url").notNull(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(), // Video URL
  duration: text("duration").notNull(), // Display duration e.g. "10:05"
  order: integer("order").notNull(), // For sequential locking
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Text content or link
  order: integer("order").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // For now, we can assume a single user or session based ID
  videoId: integer("video_id").notNull(),
  isCompleted: boolean("is_completed").default(false),
  lastPosition: integer("last_position").default(0), // Timestamp in seconds
});

// === SCHEMAS ===

export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true });
export const insertProgressSchema = createInsertSchema(userProgress).omit({ id: true });

// === TYPES ===

export type Course = typeof courses.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Progress = typeof userProgress.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

// API Response types
export interface CourseWithContent extends Course {
  videos: Video[];
  notes: Note[];
}
