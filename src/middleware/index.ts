import { json, urlencoded } from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

import { logger, errorHandler } from "./custom";

const middlewares = [
  cors(),
  helmet(),
  json(),
  urlencoded({ extended: true }),
  compression(),
  logger,
  errorHandler,
];

export default middlewares;
