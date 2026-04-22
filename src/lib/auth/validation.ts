import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});