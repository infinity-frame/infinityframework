import { NextFunction, Request, Response, Router } from "express";
import { AuthWebController } from "../controllers/AuthWebController.js";

export function AuthRouterFactory(authController: AuthWebController): Router {
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
