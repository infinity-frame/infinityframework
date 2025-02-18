import { UserCredentialsDTO } from "./authValidation.ts";

interface RequestValues {
  UserCredentials: UserCredentialsDTO;
}

declare module "express-serve-static-core" {
  interface Request {
    ifvalues: RequestValues;
  }
}
