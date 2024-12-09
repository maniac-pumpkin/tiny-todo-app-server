import type { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

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

export const logger: RequestHandler = (req, _, next) => {
  const time = new Date(Date.now()).toString();
  console.info(req.method, req.hostname, req.path, time);
  next();
};
