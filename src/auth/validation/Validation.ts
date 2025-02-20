import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import createHttpError from "http-errors";

export function MiddlewareValidatorFactory(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(
        createHttpError(400, "Validation error.", { code: "ERR_VALIDATION" })
      );
    }
  };
}
