import { ProjectStatus } from "app/types";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Tên phải có ít nhất 3 ký tự")
      .max(50, "Tên quá dài"),
    email: z.string().trim().email("Email không hợp lệ"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, "name must be required"),
  color: z.string().optional(),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "title must be required"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(1, "start Date must be required"),
  dueDate: z.string().min(1, "due Date must be required"),
  members: z.array(
    z.object({
      user: z.string(),
      role: z.enum(["manager","contributor","viewer"]),
    })
  ).optional(),
  tags: z.string().optional(),
});
