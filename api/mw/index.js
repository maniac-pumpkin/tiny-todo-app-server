import { json, urlencoded } from "express";
import cors from "cors";

import { logger, errorHandler } from "./custom.js";

const middlewares = [
  cors(),
  json(),
  urlencoded({ extended: true }),
  logger,
  errorHandler,
];

export default middlewares;
