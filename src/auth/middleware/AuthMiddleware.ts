import { NextFunction, Request, Response, RequestHandler } from "express";
import { AuthController } from "../controllers/AuthController.js";

export function AuthMiddlewareFactory(
  authController: AuthController
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO
  };
}
