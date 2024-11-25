import { Router } from "express";
import { z } from "zod";
import {
  registerUser,
  signInUser,
  verifyUserEmail,
} from "../controllers/users.controller.js";
import { validateReqBody } from "../mw/custom.js";

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

route.post("/register", validateReqBody(userRegistrationSchema), registerUser);
route.post("/sign-in", validateReqBody(signInUserSchema), signInUser);
route.get("/:userId/:token", verifyUserEmail);

export default route;
