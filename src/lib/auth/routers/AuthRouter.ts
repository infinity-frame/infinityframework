import { json, NextFunction, Request, Response, Router } from "express";
import { AuthWebController } from "../controllers/AuthWebController.js";
import createHttpError, { isHttpError } from "http-errors";
import { AuthMiddlewareFactory } from "../middleware/AuthMiddleware.js";
import { Logger } from "pino";

export function AuthRouterFactory(
  authController: AuthWebController,
  logger: Logger
): Router {
  const router = Router();

  router.post(
    "/session",
    json(),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await authController.login(req, res);
      } catch (err) {
        next(err);
      }
    }
  );

  const authMiddleware = AuthMiddlewareFactory(authController, logger);
  router.use(authMiddleware);

  router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.identify(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.delete(
    "/session",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await authController.logout(req, res);
      } catch (err) {
        next(err);
      }
    }
  );

  // 404
  router.use(async (req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found."));
  });

  router.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (isHttpError(err) && err.expose) {
        res.status(err.status).json({
          timestamp: new Date().toISOString(),
          message: err.message,
          issues: err.issues,
        });
      } else {
        logger.error(err);
        res.status(500).json({
          timestamp: new Date().toISOString(),
          message: "Internal server occured, please contact the maintainers.",
        });
      }
    }
  );

  return router;
}
