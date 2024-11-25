import { Router } from "express";
import { z } from "zod";
import { validateReqBody } from "../mw/custom.js";
import db from "../db.js";

const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(25, "Title must not exceed 25 characters"),
  description: z.string().max(80, "Description must not exceed 80 characters"),
  deadline: z.string(),
  is_important: z.boolean(),
  is_completed: z.boolean(),
  directory_id: z.number(),
});

const route = Router();

route.get("/", async (_, res, next) => {
  try {
    const tasks = await db.sql`SELECT * FROM tasks`;
    res.json(tasks.rows);
  } catch (error) {
    next(error);
  }
});

route.post("/", validateReqBody(taskSchema), async (req, res, next) => {
  try {
    await db.sql`
      INSERT INTO tasks (title, description, deadline, is_important, is_completed, directory_id)
      VALUES (${req.body.title}, ${req.body.description}, ${req.body.deadline}, ${req.body.is_important}, ${req.body.is_completed}, ${req.body.directory_id})`;
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

route.put("/:id", async (req, res, next) => {
  try {
    const tasks = (
      await db.sql`SELECT * FROM tasks WHERE id = ${req.params.id}`
    ).rows[0];

    console.log(tasks);
    console.log(req.body);

    await db.sql`
      UPDATE tasks
      SET title = ${req.body.title ?? tasks.title},
          description = ${req.body.description ?? tasks.description},
          deadline = ${req.body.deadline ?? tasks.deadline},
          is_important = ${req.body.is_important ?? tasks.is_important},
          is_completed = ${req.body.is_completed ?? tasks.is_completed}
      WHERE id = ${req.params.id}`;

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    await db.sql`DELETE FROM tasks WHERE id = ${req.params.id}`;
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

export default route;
