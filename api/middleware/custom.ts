import type { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import jwt from "jsonwebtoken";
import env from "../env";

export const errorHandler = (
  err: any,
  req: unknown,
  res: Response,
  next: unknown
) => {
  console.error(err);
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

// export const resolveJWToken: RequestHandler = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization!;
//     const verifiedToken = jwt.verify(token, env.JWT_SECRET_TOKEN);
//     const user = await getUserById(verifiedToken.userId);

//     if (!user) {
//       res.statusCode = 403;
//       throw new Error("Not authorized.");
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };
