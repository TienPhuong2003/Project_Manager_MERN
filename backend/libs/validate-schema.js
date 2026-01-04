import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "name is required").max(100),
  email: z.string().email("invalid email address"),
  password: z.string().min(8, "password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(8, "password must be at least 8 characters long"),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "token is required"),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "confirm password is required"),
});

const emailSchema = z.object({
  email: z.string().email("invalid email address"),
});

const workspaceSchema = z.object({
  name: z.string().min(1, "name is requied"),
  description: z.string().optional(),
  color: z.string().min(1, "color is required"),
});
export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  emailSchema,
  workspaceSchema,
};
