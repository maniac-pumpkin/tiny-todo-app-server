import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { directories } from "../db/schema";
import db from "../db";

export const getDirsByUserId: RequestHandler = async (req, res, next) => {
  try {
    const dirsById = await db
      .select()
      .from(directories)
      .where(eq(directories.userId, req.body.userId));

    res.status(200).json(dirsById);
  } catch (error) {
    next(error);
  }
};

export const createDir: RequestHandler = async (req, res, next) => {
  try {
    const [newDir] = await db
      .insert(directories)
      .values({
        name: req.body.name,
        userId: req.body.userId,
      })
      .returning();

    res.status(201).json(newDir);
  } catch (error) {
    next(error);
  }
};

export const updateDir: RequestHandler = async (req, res, next) => {
  try {
    const [updatedDir] = await db
      .update(directories)
      .set({ name: req.body.name })
      .where(eq(directories.id, +req.params.id))
      .returning();

    res.status(200).json(updatedDir);
  } catch (error) {
    next(error);
  }
};

export const deleteDir: RequestHandler = async (req, res, next) => {
  try {
    const [deletedDir] = await db
      .delete(directories)
      .where(eq(directories.id, +req.params.id))
      .returning();

    res.status(204).json(deletedDir);
  } catch (error) {
    next(error);
  }
};
