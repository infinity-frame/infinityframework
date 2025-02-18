import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

function MiddlewareValidatorFactory(schema: z.ZodSchema) {
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

/** Users */
const UserCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export const UserCredentialsValidationMiddleware = MiddlewareValidatorFactory(
  UserCredentialsSchema
);
export type UserCredentialsDTO = z.infer<typeof UserCredentialsSchema>;

const CreateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export const CreateUserValidationMiddleware =
  MiddlewareValidatorFactory(CreateUserSchema);
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

const UpdateUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .partial();
export const UpdateUserValidationMiddleware =
  MiddlewareValidatorFactory(UpdateUserSchema);
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export type UserSensitiveDTO = {
  username: string;
  passwordHash: string;
  createdAt: string;
  _id: string;
};

export type UserDTO = Omit<UserSensitiveDTO, "passwordHash">;

export interface UserFilterOptions {
  _id?: string;
  username?: string;
}

/** Sessions */
export type SessionDTO = {
  _id: string;
  token: string;
  userId: string;
  lastUsed: string;
};

export type CreateSessionDTO = {
  token: string;
  userId: string;
};

export type UpdateSessionDTO = {
  lastUsed?: string;
};

export interface SessionFilterOptions {
  _id?: string;
  token?: string;
  userId?: string;
}
