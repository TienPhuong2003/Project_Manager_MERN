import express from "express";
import { taskSchema } from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createTask,
  getTaskById,
  updateTask,
  updateTaskAssignees,
  addSubTask,
  updateSubTask,
  getTaskActivity,
  completedSubTask
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


router.post(
  "/:taskId/add-subtask",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
    body: z.object({title: z.string()}),
  }),
  addSubTask
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

router.put(
  "/:taskId/assignees",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ assignees: z.array(z.string()) }),
  }),
  updateTaskAssignees
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
      status: z
        .enum(["To Do", "In Progress", "Completed", "Cancelled"])
        .optional(),
    }),
  }),
  updateTask
);


router.put(
  "/:taskId/update-subtask/:subTaskId",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  updateSubTask
);

router.put(
  "/:taskId/complete-subtask/:subTaskId",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string() }),
    body: z.object({ completed: z.boolean() }),
  }),
  completedSubTask
);

router.get(
  "/:resourceId/activity",
  authMiddleware,
  validateRequest({
    params: z.object({
      resourceId: z.string(),
    }),
  }),
  getTaskActivity
);


export default router;
