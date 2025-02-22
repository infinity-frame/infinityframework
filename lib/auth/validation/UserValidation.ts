import { z } from "zod";
import { MiddlewareValidatorFactory } from "./Validation.js";

const CreateUserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export const CreateUserValidationMiddleware = MiddlewareValidatorFactory(
  CreateUserInputSchema
);
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

const UpdateUserInputSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .partial();
export const UpdateUserValidationMiddleware = MiddlewareValidatorFactory(
  UpdateUserInputSchema
);
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
