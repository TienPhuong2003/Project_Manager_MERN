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
  name: z.string().min(1, "name is required"),
  description: z.string().optional(),
  color: z.string().min(1, "color is required"),
});

const projectSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  status: z.enum([
    "Planning",
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled"
  ]),
  startDate: z.string().min(1, "start date is required"),
  dueDate: z.string().min(1, "due date is required"),
  tags: z.string().optional(),
  members: z.array(z.object({
    user: z.string(),
    role: z.enum(["manager", "contributor", "viewer"]),
  })).optional()
});

const taskSchema =z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  status: z.enum([
    "To Do",
    "In Progress",
    "Completed",
    "Cancelled"
  ]),
  priority: z.enum(["Low","Medium","High"]),
  dueDate: z.string().min(1, "due date is required"),
  assignees: z.array(z.string()).min(1,"At least one asignee is required")
})


export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  emailSchema,
  workspaceSchema,
  projectSchema,
  taskSchema
};
