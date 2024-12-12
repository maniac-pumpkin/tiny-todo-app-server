import { Router } from "express";
import { z } from "zod";
import { resolveAuthToken, validateReqKey } from "../middleware/custom";
import {
  deleteDir,
  updateDir,
  createDir,
  getDirsByUserId,
} from "../controllers/directories.controller";

const commonBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Directory name is required" })
    .max(20, { message: "Directory name must be 20 characters or less" }),
});

const route = Router();

route.get("/", resolveAuthToken, getDirsByUserId);

route.post(
  "/",
  resolveAuthToken,
  validateReqKey(commonBodySchema, "body"),
  createDir
);

route.put(
  "/:id",
  resolveAuthToken,
  validateReqKey(commonBodySchema, "body"),
  updateDir
);

route.delete("/:id", resolveAuthToken, deleteDir);

export default route;
