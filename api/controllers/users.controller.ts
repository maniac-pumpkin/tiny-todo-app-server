import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { and, eq, gt, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";

import db from "../db";
import { users, verifyToken } from "../db/schema";
import env from "../env";
import { sendVerificationMail } from "../helpers/email-utils";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 8);
    const [addedUser] = await db
      .insert(users)
      .values({
        username: req.body.username,
        password: hashedPass,
        email: req.body.email,
      })
      .returning();

    await sendVerificationMail(addedUser!.id, addedUser!.email);

    res.send("Email has been sent for verification, Please check your inbox.");
  } catch (error) {
    next(error);
  }
};

export const signInUser: RequestHandler = async (req, res, next) => {
  try {
    const [availableUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.username, req.body.username)));

    if (!availableUser) {
      res.statusCode = 404;
      throw "User not found.";
    }

    if (!availableUser!.isVerified) {
      res.statusCode = 403;
      await sendVerificationMail(availableUser!.id, availableUser!.email);
      throw "Email is not verified.";
    }

    const isPassCorrect = await bcrypt.compare(
      req.body.password,
      availableUser!.password
    );

    if (!isPassCorrect) {
      res.statusCode = 404;
      throw "User not found.";
    }

    const jwtToken = jwt.sign({ id: availableUser!.id }, env.JWT_SECRET_TOKEN, {
      expiresIn: "24h",
    });

    res.send(jwtToken);
  } catch (error) {
    next(error);
  }
};

export const verifyUserEmail: RequestHandler = async (req, res, next) => {
  try {
    const [availableToken] = await db
      .select()
      .from(verifyToken)
      .where(
        and(
          eq(verifyToken.userId, +req.params.userId),
          eq(verifyToken.token, req.params.token),
          gt(verifyToken.expDate, sql`NOW()`)
        )
      );

    if (!availableToken) {
      res.statusCode = 410;
      throw "Verification token is no longer valid";
    }

    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, +req.params.userId));

    await db
      .delete(verifyToken)
      .where(eq(verifyToken.userId, +req.params.userId));

    res.send("Email has been successfully verified.");
  } catch (error) {
    next(error);
  }
};
