import express from "express";
import { taskSchema } from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import { createTask } from "../controller/task-controller.js";
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

export default router;
