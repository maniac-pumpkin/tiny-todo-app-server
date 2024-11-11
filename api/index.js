import express from "express";
import "dotenv/config";

import pool from "./db/pool.js";

const server = express();

server.get("/pets", async (_, res) => {
  const data = await pool.sql`SELECT * FROM pets`;
  res.status(200).json(data.rows);
});

const SERVER_PORT = process.env["SERVER_PORT"];
const SERVER_URL = process.env["SERVER_URL"];

server.listen(SERVER_PORT, () =>
  console.log(`Server is running on ${SERVER_URL}`)
);

export default server;
