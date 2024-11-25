import "dotenv/config";
import express from "express";

import env from "./env.js";
import middlewares from "./mw/index.js";

import usersRoute from "./routes/users.route.js";
import directoriesRoute from "./routes/directories.route.js";
import tasksRoute from "./routes/tasks.route.js";

const server = express();

server.use(middlewares);
// server.use("/users", usersRoute);
server.use("/tasks", tasksRoute);
server.use("/directories", directoriesRoute);
server.use("*", (_, res) => res.sendStatus(404));

server.listen(env.SERVER_PORT, () =>
  console.info(`Server is running on ${env.SERVER_URL}:${env.SERVER_PORT}`)
);

export default server;
