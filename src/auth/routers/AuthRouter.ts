import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

export function AuthRouterFactory(authController: AuthController): Router {
  const router = Router();

  router.post(
    "/auth",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        authController.login(req, res);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
