import express from "express";

const server = express();

server.get("/", (_, res) => res.send("Sup"));

const SERVER_PORT = process.env["SERVER_PORT"] || 3000;
server.listen(SERVER_PORT, () =>
  console.log(`Server is running on ${SERVER_PORT}`)
);

export default server;
