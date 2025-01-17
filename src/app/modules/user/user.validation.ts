import { z } from 'zod';

const userModelSchema = z.object({
  body: z.object({
    password: z.string(),
    role: z.enum(['admin', 'user']).default('user'),
    status: z.enum(['in-progress', 'blocked']).default('in-progress'),
    isDeleted: z.boolean(),
    name: z.string(),
    email: z.string().email(),
    isBlocked: z.boolean().default(false),
  }),
});
const userCreationSchema = z.object({
  body: z.object({
    password: z.string(),
    role: z.enum(['admin', 'user']).default('user').optional(),
    status: z
      .enum(['in-progress', 'blocked'])
      .default('in-progress')
      .optional(),
    isDeleted: z.boolean().optional(),
    name: z.string(),
    email: z.string().email(),
    isBlocked: z.boolean().optional(),
  }),
});
const userLoginSchema = z.object({
  body: z.object({
    password: z.string(),
    role: z.enum(['admin', 'user']).default('user').optional(),
    status: z
      .enum(['in-progress', 'blocked'])
      .default('in-progress')
      .optional(),
    isDeleted: z.boolean().optional().default(false),
    name: z.string().optional(),
    email: z.string().email(),
    isBlocked: z.boolean().default(false).optional(),
  }),
});

export const userSchema = {
  userModelSchema,
  userCreationSchema,
  userLoginSchema,
};
