import { z } from 'zod';

export const blogSchema = z.object({
  body: z.object({
    _id: z.string().optional(),
    title: z.string(),
    content: z.string(),
    isPublished: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});
