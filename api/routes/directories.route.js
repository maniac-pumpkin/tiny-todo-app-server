import { Router } from "express";
import { z } from "zod";
import { validateReqBody, validateReqParams } from "../mw/custom.js";
import {
  getDirectories,
  createDirectory,
  updateDirectory,
  deleteDirectory,
  getTasksByDirectoryId,
} from "../controllers/directories.controller.js";

const createDirectorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(15, "Name must not exceed 15 characters"),
  userId: z.number(),
});

const updateDirectoryBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(15, "Name must not exceed 15 characters"),
});

const paramsIdSchema = z.object({
  id: z.string(),
});

const route = Router();

route.get("/", getDirectories);
route.get("/:dirId/tasks", getTasksByDirectoryId);
route.post("/", validateReqBody(createDirectorySchema), createDirectory);
route.put(
  "/:id",
  validateReqParams(paramsIdSchema),
  validateReqBody(updateDirectoryBodySchema),
  updateDirectory
);
route.delete("/:id", validateReqParams(paramsIdSchema), deleteDirectory);

export default route;
