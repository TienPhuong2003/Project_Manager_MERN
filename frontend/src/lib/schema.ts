import { ProjectStatus } from "app/types";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters"
    ),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name is too long"),

    email: z.string().trim().email("Invalid email address"),

    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters"
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  color: z.string().optional(),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Project title must be required"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(1, "Start Date must be required"),
  dueDate: z.string().min(1, "Due Date must be required"),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    )
    .optional(),
  tags: z.string().optional(),
});

export const createtaskSchema = z.object({
  title: z.string().min(1, "Task title must be required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Completed","Cancelled"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due Date must be required"),
  assignees: z.array(z.string()).min(1,"At least one asignee is required")
});
