import type { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import jwt from "jsonwebtoken";
import env from "../helpers/env";

export const logger: RequestHandler = (req, _, next) => {
  const time = new Date().toUTCString();
  console.info(req.method, req.hostname, req.path, time);
  next();
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _: unknown
) => {
  console.error(`${req.method} / Error: ${err}`);
  res
    .status(err.statusCode || 500)
    .send(err.message || "Internal server error");
};

export const validateReqKey = (schema: ZodSchema, reqKey: keyof Request) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[reqKey]);
      next();
    } catch (error) {
      if (error instanceof ZodError)
        res
          .status(400)
          .send(
            error.errors
              .map(({ path, message }) => `${path.at(0)}: ${message}`)
              .join(", ")
          );
      else next(error);
    }
  };
};

export const resolveAuthToken: RequestHandler = async (req, _, next) => {
  try {
    const authToken = req.headers.authorization;

    if (
      !authToken?.startsWith("Bearer ") ||
      !authToken.split("Bearer ").at(1)
    ) {
      req.statusCode = 401;
      throw "Invalid auth token.";
    }

    const verifiedToken = jwt.verify(
      authToken.split("Bearer ").at(1)!,
      env.JWT_SECRET_TOKEN
    ) as {
      userId: number;
      iat: number;
      exp: number;
    };

    req.body = { ...req.body, userId: verifiedToken.userId };

    next();
  } catch (error) {
    next(error);
  }
};
