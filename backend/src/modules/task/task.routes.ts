import { Router } from "express";
import * as TaskController from "./task.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "./task.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(TaskController.getTasks));
router.post("/", validate(createTaskSchema), asyncHandler(TaskController.createTask));
router.put("/:id", validate(updateTaskSchema), asyncHandler(TaskController.updateTask));
router.delete("/:id", asyncHandler(TaskController.deleteTask));

export default router;
