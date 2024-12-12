import { Router } from "express";
import { z } from "zod";
import {
  signUpUser,
  signInUser,
  deleteUser,
  verifyUserEmail,
} from "../controllers/users.controller";
import { validateReqKey, resolveAuthToken } from "../middleware/custom";

const userSignInSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(100, "Username must not exceed 100 characters")
    .transform((value) => value.replaceAll(" ", "").toLowerCase()),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

const userSignUpSchema = userSignInSchema.extend({
  email: z.string().trim().email("Invalid email address"),
});

const route = Router();

route.post("/sign-up", validateReqKey(userSignUpSchema, "body"), signUpUser);

route.post("/sign-in", validateReqKey(userSignInSchema, "body"), signInUser);

route.delete("/", resolveAuthToken, deleteUser);

route.get("/:userId/:token", verifyUserEmail);

export default route;
