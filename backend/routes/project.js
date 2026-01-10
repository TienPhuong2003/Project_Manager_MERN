import express from "express";
import { projectSchema } from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import { createProject, getProjectTasks } from "../controller/project-controller.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  getProjectTasks
);

export default router;
