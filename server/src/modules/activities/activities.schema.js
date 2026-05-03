import { z } from 'zod';

const ActivityType = z.enum(['CALL', 'EMAIL', 'MEETING', 'NOTE', 'FOLLOW_UP']);

export const createActivitySchema = z.object({
  type: ActivityType,
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  completed: z.boolean().optional().default(false),
});

export const updateActivitySchema = createActivitySchema.partial();
