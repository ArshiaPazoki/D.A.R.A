import { z } from 'zod';

export const loginSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  memberId: z.string().min(1, 'Member ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  parentId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const propertySchema = z.object({
  type: z.enum(['apartment', 'villa', 'land', 'commercial']),
  area: z.number().min(1, 'Area is required'),
  elevator: z.boolean(),
  parkingSpots: z.number().min(0),
  rooms: z.number().min(0),
  yearBuilt: z.number().min(1300).max(1450), // Persian year
  description: z.string().optional(),
  price: z.number().optional(),
});