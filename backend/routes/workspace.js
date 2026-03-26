import express from "express";
import {
  workspaceSchema,
  inviteMemberSchema,
} from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
  acceptGenerateInvite,
  acceptInviteToken,
} from "../controller/workspace-controller.js";
import { z } from "zod";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace,
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ param: z.object({ token: z.string() }) }),
  acceptInviteToken,
);
router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    param: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace,
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({
    param: z.object({ workspaceId: z.string() }),
  }),
  acceptGenerateInvite,
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
export default router;
