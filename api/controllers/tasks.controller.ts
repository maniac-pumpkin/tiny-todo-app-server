import type { RequestHandler } from "express";
import { eq, sql } from "drizzle-orm";
import { tasks, directories } from "../db/schema";
import db from "../db";

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasksByUser = await db
      .select()
      .from(tasks)
      .innerJoin(directories, eq(tasks.directoryId, directories.id))
      .where(eq(directories.userId, req.body.userId));

    res.status(200).json(tasksByUser);
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const [createdTask] = await db
      .insert(tasks)
      .values({
        title: req.body.title,
        description: req.body.description ?? "",
        deadline: req.body.deadline,
        isCompleted: req.body.isCompleted ?? false,
        isImportant: req.body.isImportant ?? false,
        directoryId: +req.params.dirId,
      })
      .returning();

    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        title: req.body.title ?? sql`${tasks.title}`,
        description: req.body.description ?? sql`${tasks.description}`,
        deadline: req.body.deadline ?? sql`${tasks.deadline}`,
        isCompleted: req.body.isCompleted ?? sql`${tasks.isCompleted}`,
        isImportant: req.body.isImportant ?? sql`${tasks.isImportant}`,
        directoryId: sql`${tasks.directoryId}`,
      })
      .where(eq(tasks.id, +req.params.taskId))
      .returning();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, +req.params.taskId))
      .returning();

    res.status(204).json(deletedTask);
  } catch (error) {
    next(error);
  }
};
