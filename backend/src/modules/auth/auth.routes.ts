import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/signup", validate(signupSchema), asyncHandler(AuthController.signup));
router.post("/login", validate(loginSchema), asyncHandler(AuthController.login));

export default router;
