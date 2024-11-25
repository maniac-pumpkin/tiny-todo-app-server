import db from "../db.js";

export const createDirectory = async (req, res, next) => {
  try {
    await db.sql`INSERT INTO directories (name, user_id) VALUES (${req.body.name}, ${req.body.userId})`;
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

export const getDirectories = async (_, res, next) => {
  try {
    const directories = await db.sql`SELECT * FROM directories`;
    res.json(directories.rows);
  } catch (error) {
    next(error);
  }
};

export const getTasksByDirectoryId = async (req, res, next) => {
  try {
    const tasks =
      await db.sql`SELECT * FROM tasks WHERE directory_id = ${req.params.dirId}`;
    res.json(tasks.rows);
  } catch (error) {
    next(error);
  }
};

export const updateDirectory = async (req, res, next) => {
  try {
    await db.sql`UPDATE directories SET name = ${req.body.name} WHERE id = ${req.params.id}`;
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const deleteDirectory = async (req, res, next) => {
  try {
    await db.sql`DELETE FROM directories WHERE id = ${req.params.id}`;
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
