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
  completedSubTask,
  getCommentsByTaskId,
  addComment,
  watchTask,
  archiveTask,
  getMyTasks,
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
  createTask,
);

router.post(
  "/:taskId/add-subtask",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
    body: z.object({ title: z.string() }),
  }),
  addSubTask,
);

router.post(
  "/:taskId/add-comment",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
    body: z.object({ text: z.string() }),
  }),
  addComment,
);

router.post(
  "/:taskId/watch-task",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  watchTask,
);

router.post(
  "/:taskId/archive-task",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  archiveTask,
);

router.get("/my-tasks", authMiddleware, getMyTasks);

router.get(
  "/:taskId",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  getTaskById,
);



router.put(
  "/:taskId/assignees",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ assignees: z.array(z.string()) }),
  }),
  updateTaskAssignees,
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
  updateTask,
);

router.put(
  "/:taskId/update-subtask/:subTaskId",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  updateSubTask,
);

router.put(
  "/:taskId/complete-subtask/:subTaskId",
  authMiddleware,
  validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string() }),
    body: z.object({ completed: z.boolean() }),
  }),
  completedSubTask,
);

router.get(
  "/:resourceId/activity",
  authMiddleware,
  validateRequest({
    params: z.object({
      resourceId: z.string(),
    }),
  }),
  getTaskActivity,
);

router.get(
  "/:taskId/comments",
  authMiddleware,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  getCommentsByTaskId,
);

export default router;
