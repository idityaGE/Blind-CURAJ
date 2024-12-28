import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email(),
  pin: z.string().min(4).max(4),
});

export type SignInInput = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  pin: z.string().min(4).max(4).regex(/^\d+$/, 'PIN must contain only numbers'),
  name: z.string().min(2).max(50).optional(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;