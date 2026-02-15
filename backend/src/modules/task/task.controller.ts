import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import * as TaskService from "./task.service.js";
import { AppError } from "../../middleware/error.middleware.js";

export const getTasks = async (req: AuthRequest, res: Response) => {
  const result = await TaskService.getTasks(
    req.user!.userId,
    req.query
  );
  res.json(result);
};


export const createTask = async (req: AuthRequest, res: Response) => {
    const task = await TaskService.createTask(
        req.body,
        req.user!.userId
    );
    res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        throw new AppError("Task ID is required", 400);
    }

    const task = await TaskService.updateTask(
        id,
        req.body,
        req.user!.userId
    );

    if (!task) throw new AppError("Task not found", 404);

    res.json(task);
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        throw new AppError("Task ID is required", 400);
    }
    await TaskService.deleteTask(id, req.user!.userId);
    res.status(204).send();
};
