import "dotenv/config";
import express from "express";

import env from "./env";
import middlewares from "./middleware";

import usersRoute from "./routes/users.route";

const server = express();

server.use(middlewares);
server.use("/users", usersRoute);

server.listen(env.SERVER_PORT, () =>
  console.info(`Server is running on ${env.SERVER_URL}:${env.SERVER_PORT}`)
);

export default server;
