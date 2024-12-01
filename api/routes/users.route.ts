import { Router } from "express";
import { z } from "zod";
import {
  signInUser,
  registerUser,
  verifyUserEmail,
} from "../controllers/users.controller";
import { validateReqKey } from "../mw/custom";

const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(100, "Username must not exceed 100 characters")
    .transform((value) => value.replaceAll(" ", "").toLowerCase()),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
  email: z.string().trim().email("Invalid email address"),
});

const signInUserSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string(),
});

const route = Router();

route.post(
  "/register",
  validateReqKey(userRegistrationSchema, "body"),
  registerUser
);
route.post("/sign-in", validateReqKey(signInUserSchema, "body"), signInUser);
route.get("/:userId/:token", verifyUserEmail);

export default route;
