import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import createHttpError from "http-errors";
import { ValidationException } from "../exceptions.js";

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

export function ValidatorFactory<T>(schema: z.ZodSchema) {
  return (inp: unknown) => {
    const result = schema.safeParse(inp);
    if (!result.success) {
      throw new ValidationException(result.error.issues);
    }
    return inp as T;
  };
}
