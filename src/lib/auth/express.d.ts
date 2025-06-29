import { Session } from "./models/Session.ts";
import { User } from "./models/User.ts";

declare module "express-serve-static-core" {
  interface Request {
    user: User;
    session: Session;
  }
}
