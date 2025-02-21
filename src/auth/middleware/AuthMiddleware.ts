import { NextFunction, Request, Response, RequestHandler } from "express";
import { AuthWebController } from "../controllers/AuthWebController.js";

export function AuthMiddlewareFactory(
  authController: AuthWebController
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO
  };
}
