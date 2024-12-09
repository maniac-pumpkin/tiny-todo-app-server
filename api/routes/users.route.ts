import { Router } from "express";
import { z } from "zod";
import {
  signUpUser,
  signInUser,
  deleteUser,
  verifyUserEmail,
} from "../controllers/users.controller";
import { validateReqKey } from "../middleware/custom";

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

const userRegistrationSchema = userSignInSchema.extend({
  email: z.string().trim().email("Invalid email address"),
});

const userVerifyEmailSchema = z.object({
  userId: z.string(),
  token: z.string(),
});

const deleteUserSchema = z.object({
  authorization: z.string().trim().includes("Bearer"),
});

const route = Router();

route.post(
  "/sign-up",
  validateReqKey(userRegistrationSchema, "body"),
  signUpUser
);

route.post("/sign-in", validateReqKey(userSignInSchema, "body"), signInUser);

route.get(
  "/:userId/:token",
  validateReqKey(userVerifyEmailSchema, "params"),
  verifyUserEmail
);

route.delete("/", validateReqKey(deleteUserSchema, "headers"), deleteUser);

export default route;
