import express from "express";
import { taskSchema } from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createTask,
  getTaskById,
  updateTask,
} from "../controller/task-controller.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/:projectId/create-task",
  authMiddleware,
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
    body: taskSchema,
  }),
  createTask
);

router.get(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  getTaskById
);

router.patch(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
    data: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["To Do", "In Progress", "Completed", "Cancelled"]).optional()
    }),
  }),
  updateTask
);


export default router;
