import { z } from "zod";
import { MiddlewareValidatorFactory, ValidatorFactory } from "./Validation.js";

const UserCredentialsInputSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type UserCredentialsInput = z.infer<typeof UserCredentialsInputSchema>;
export const UserCredentialsValidator = ValidatorFactory<UserCredentialsInput>(
  UserCredentialsInputSchema
);
