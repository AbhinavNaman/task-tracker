import Task from "./task.model.js";
import { redisClient } from "../../config/redis.js";
import { taskListKey } from "../../utils/redisKeys.js";

export const getTasks = async (
  userId: string,
  query: any
) => {
  const { page = 1, limit = 10, status, dueBefore } = query;

  const cacheKey = `${taskListKey(userId)}:${page}:${limit}:${status || "all"}:${dueBefore || "none"}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const filter: any = { owner: userId };

  if (status) filter.status = status;
  if (dueBefore) filter.dueDate = { $lte: new Date(dueBefore) };

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Task.countDocuments(filter);

  const result = {
    data: tasks,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };

  await redisClient.set(cacheKey, JSON.stringify(result), {
    EX: 60,
  });

  return result;
};

export const createTask = async (data: any, userId: string) => {
  const task = await Task.create({ ...data, owner: userId });
  await invalidateUserTasksCache(userId);
  return task;
};

export const updateTask = async (
  taskId: string,
  data: any,
  userId: string
) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: userId },
    data,
    { new: true }
  );

  await invalidateUserTasksCache(userId);
  return task;
};

export const deleteTask = async (taskId: string, userId: string) => {
  await Task.findOneAndDelete({ _id: taskId, owner: userId });
  await invalidateUserTasksCache(userId);
};

const invalidateUserTasksCache = async (userId: string) => {
  const pattern = `${taskListKey(userId)}*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
