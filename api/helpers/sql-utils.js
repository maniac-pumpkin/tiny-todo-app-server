import db from "../db.js";

export const insertNewUser = async ({ name, password, email }) =>
  (
    await db.sql`
      INSERT INTO users (name, password, email)
      VALUES (${name},
      ${password},
      ${email})
      RETURNING *`
  ).rows.at(0);

export const insertNewVerifyToken = async ({ userId, token }) =>
  await db.sql`
    INSERT INTO verify_token (user_id, token)
    VALUES (${userId}, ${token}) RETURNING *`;

export const getUserByEmail = async (email) =>
  (
    await db.sql`
      SELECT * FROM users
      WHERE email = ${email}`
  ).rows.at(0);

export const getUserById = async (id) =>
  (
    await db.sql`
      SELECT * FROM users
      WHERE id = ${id}`
  ).rows.at(0);

export const getVerifyToken = async ({ userId, token }) =>
  (
    await db.sql`
      SELECT * FROM verify_token
      WHERE user_id = ${userId} AND token = ${token} AND exp_date > NOW()`
  ).rows.at(0);

export const updateIsVerified = async (userId) =>
  await db.sql`
    UPDATE users
    SET is_verified = true
    WHERE id = ${userId}`;

export const deleteVerifyToken = async ({ userId, token }) =>
  await db.sql`
    DELETE FROM verify_token
    WHERE user_id = ${userId} AND token = ${token}`;
