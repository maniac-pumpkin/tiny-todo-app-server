import "dotenv/config";
import express from "express";
import serverlessHttp from "serverless-http";

import env from "./helpers/env";
import middlewares from "./middleware";

import usersRoute from "./routes/users.route";
import tasksRoute from "./routes/tasks.route";
import directoriesRoute from "./routes/directories.route";

const server = express();

server.get("/", (_, res) => {
  res.send("Welcome");
});

server.use(middlewares);
server.use("/api/users", usersRoute);
server.use("/api/tasks", tasksRoute);
server.use("/api/directories", directoriesRoute);

server.listen(env.SERVER_PORT, () =>
  console.info(`Server is running on ${env.SERVER_URL}:${env.SERVER_PORT}`)
);

export const handler = serverlessHttp(server);
