import { z } from 'zod';
import { insertCourseSchema, insertProgressSchema, courses, videos, notes, userProgress } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/courses/:id',
      responses: {
        200: z.custom<typeof courses.$inferSelect & { videos: typeof videos.$inferSelect[], notes: typeof notes.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  progress: {
    list: {
      method: 'GET' as const,
      path: '/api/progress', // Get all progress for current user
      responses: {
        200: z.array(z.custom<typeof userProgress.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/progress',
      input: insertProgressSchema,
      responses: {
        200: z.custom<typeof userProgress.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE EXPORTS
// ============================================
export type CourseListResponse = z.infer<typeof api.courses.list.responses[200]>;
export type CourseDetailResponse = z.infer<typeof api.courses.get.responses[200]>;
export type ProgressListResponse = z.infer<typeof api.progress.list.responses[200]>;
export type UpdateProgressInput = z.infer<typeof api.progress.update.input>;
