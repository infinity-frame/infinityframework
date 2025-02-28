import { z } from "zod";
import { MiddlewareValidatorFactory } from "./Validation.js";

const CreateUserInputSchema = z.object({
  username: z.string(),
  password: z.string(),
  permissions: z.array(z.string()).optional(),
});
export const CreateUserValidationMiddleware = MiddlewareValidatorFactory(
  CreateUserInputSchema
);
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

const UpdateUserInputSchema = z
  .object({
    username: z.string().optional(),
    password: z.string().optional(),
    permissions: z.array(z.string()).optional(),
  })
  .partial();
export const UpdateUserValidationMiddleware = MiddlewareValidatorFactory(
  UpdateUserInputSchema
);
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
