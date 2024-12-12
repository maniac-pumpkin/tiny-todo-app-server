import { Router } from "express";
import { z } from "zod";
import {
  signUpUser,
  signInUser,
  deleteUser,
  updateUser,
  verifyUserEmail,
} from "../controllers/users.controller";
import { validateReqKey, resolveAuthToken } from "../middleware/custom";

const userSignInSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(100)
    .transform((value) => value.replaceAll(" ", "").toLowerCase()),
  password: z.string().trim().min(8),
});

const userSignUpSchema = userSignInSchema.extend({
  email: z.string().trim().email().max(254),
});

const userUpdateSchema = z.object({
  username: userSignUpSchema.shape.username.nullable(),
  password: userSignUpSchema.shape.password.nullable(),
  email: userSignUpSchema.shape.email.nullable(),
});

const route = Router();

route.post("/sign-up", validateReqKey(userSignUpSchema, "body"), signUpUser);

route.post("/sign-in", validateReqKey(userSignInSchema, "body"), signInUser);

route.put(
  "/",
  resolveAuthToken,
  validateReqKey(userUpdateSchema, "body"),
  updateUser
);

route.delete("/", resolveAuthToken, deleteUser);

route.get("/:userId/:token", verifyUserEmail);

export default route;
