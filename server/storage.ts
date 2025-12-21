import { 
  users, courses, videos, notes, userProgress,
  type Course, type Video, type Note, type Progress,
  type InsertCourse, type InsertVideo, type InsertNote, type InsertProgress
} from "@shared/schema";

export interface IStorage {
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  
  // Content
  getVideosByCourseId(courseId: number): Promise<Video[]>;
  getNotesByCourseId(courseId: number): Promise<Note[]>;
  
  // Progress
  getProgress(userId: number): Promise<Progress[]>;
  updateProgress(progress: InsertProgress): Promise<Progress>;
}

export class MemStorage implements IStorage {
  private courses: Map<number, Course>;
  private videos: Map<number, Video>;
  private notes: Map<number, Note>;
  private progress: Map<number, Progress>;
  
  private courseId: number = 1;
  private videoId: number = 1;
  private noteId: number = 1;
  private progressId: number = 1;

  constructor() {
    this.courses = new Map();
    this.videos = new Map();
    this.notes = new Map();
    this.progress = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed SPPU Course
    const sppuId = this.courseId++;
    this.courses.set(sppuId, {
      id: sppuId,
      title: "Computer Engineering - Semester 1 (SPPU)",
      description: "Fundamental concepts for first year engineering students. Free access.",
      type: "SPPU",
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    });

    this.videos.set(this.videoId++, {
      id: this.videoId - 1,
      courseId: sppuId,
      title: "1. Introduction to Engineering Mathematics",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      duration: "15:30",
      order: 1,
    });
    
    this.videos.set(this.videoId++, {
      id: this.videoId - 1,
      courseId: sppuId,
      title: "2. Differential Equations Basics",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      duration: "22:15",
      order: 2,
    });

    this.videos.set(this.videoId++, {
      id: this.videoId - 1,
      courseId: sppuId,
      title: "3. Matrices and Linear Algebra",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      duration: "18:45",
      order: 3,
    });

    this.notes.set(this.noteId++, {
      id: this.noteId - 1,
      courseId: sppuId,
      title: "Syllabus Copy",
      content: "Unit 1: Differential Calculus\nUnit 2: Integral Calculus...",
      order: 1,
    });

    // Seed Autonomy Course
    const autonomyId = this.courseId++;
    this.courses.set(autonomyId, {
      id: autonomyId,
      title: "Advanced AI & Machine Learning (Autonomy)",
      description: "Premium course for autonomous college students covering Deep Learning.",
      type: "Autonomy",
      thumbnailUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    });

    this.videos.set(this.videoId++, {
      id: this.videoId - 1,
      courseId: autonomyId,
      title: "1. Neural Networks Fundamentals",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
      duration: "45:00",
      order: 1,
    });

    this.videos.set(this.videoId++, {
      id: this.videoId - 1,
      courseId: autonomyId,
      title: "2. Backpropagation Explained",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
      duration: "30:20",
      order: 2,
    });
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getVideosByCourseId(courseId: number): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(v => v.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getNotesByCourseId(courseId: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(n => n.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getProgress(userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId);
  }

  async updateProgress(progress: InsertProgress): Promise<Progress> {
    // Check if exists
    const existing = Array.from(this.progress.values()).find(
      p => p.userId === progress.userId && p.videoId === progress.videoId
    );

    if (existing) {
      const updated = { ...existing, ...progress };
      this.progress.set(existing.id, updated);
      return updated;
    }

    const id = this.progressId++;
    const newProgress = { ...progress, id };
    this.progress.set(id, newProgress);
    return newProgress;
  }
}

export const storage = new MemStorage();
