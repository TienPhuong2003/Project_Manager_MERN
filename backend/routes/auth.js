import exxpress from "express";

import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { loginSchema, registerSchema } from "../libs/validate-schema.js";
import { registerUser, loginUser } from "../controller/auth-controller.js";

const router = exxpress.Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);

router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);

export default router;
