import { Router } from "express";
import { resolveAuthToken, validateReqKey } from "../middleware/custom";
import { z } from "zod";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller";

const route = Router();

const createTaskSchema = z.object({
  title: z.string().min(3).max(25),
  description: z.string().max(80).nullable(),
  deadline: z.string(),
  isCompleted: z.boolean().nullable(),
  isImportant: z.boolean().nullable(),
});

const updateTaskSchema = createTaskSchema.extend({
  title: createTaskSchema.shape.title.nullable(),
  deadline: createTaskSchema.shape.deadline.nullable(),
});

route.get("/", resolveAuthToken, getTasks);

route.post(
  "/:dirId",
  resolveAuthToken,
  validateReqKey(createTaskSchema, "body"),
  createTask
);

route.put(
  "/:taskId",
  resolveAuthToken,
  validateReqKey(updateTaskSchema, "body"),
  updateTask
);

route.delete("/:taskId", resolveAuthToken, deleteTask);

export default route;
