import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { getUserById } from "../helpers/sql-utils.js";
import env from "../env.js";

export function logger(req, _, next) {
  req.time = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.path, req.time);
  next();
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .send(err.message || "Internal server error");
}

export function validateReqBody(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError)
        return res
          .status(400)
          .send(error.errors.map((issue) => issue.message).join(", "));

      next(error);
    }
  };
}

export function validateReqParams(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError)
        return res
          .status(400)
          .send(error.errors.map((issue) => issue.message).join(", "));

      next(error);
    }
  };
}

export async function resolveJWToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    const verifiedToken = jwt.verify(token, env.JWT_SECRET_TOKEN);
    const user = await getUserById(verifiedToken.userId);
    if (!user) return res.status(403).send("Not authorized.");
    next();
  } catch (error) {
    next(error);
  }
}
