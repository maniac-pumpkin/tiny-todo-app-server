import express from "express"

const server = express()

const SERVER_PORT = process.env["SERVER_PORT"] || 3000
server.listen(SERVER_PORT, () =>
  console.log(`Server is running on ${SERVER_PORT}`),
)
