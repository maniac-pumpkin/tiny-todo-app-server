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
  name: z.string().min(1).max(20),
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
