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
  description: z.string().max(80).optional(),
  deadline: z.string(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
});

route.get("/", resolveAuthToken, getTasks);

route.post(
  "/:dirId",
  resolveAuthToken,
  validateReqKey(createTaskSchema, "body"),
  createTask
);

route.put("/:taskId", resolveAuthToken, updateTask);

route.delete("/:taskId", resolveAuthToken, deleteTask);

export default route;
