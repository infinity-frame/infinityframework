import { NextFunction, Request, Response, RequestHandler } from "express";
import { AuthWebController } from "../controllers/AuthWebController.js";
import { isHttpError } from "http-errors";
import { Logger } from "pino";

export function AuthMiddlewareFactory(
  authController: AuthWebController,
  logger: Logger,
  permission?: string
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.authorize(req, res, permission);
      next();
    } catch (err) {
      if (isHttpError(err) && err.expose) {
        res.status(err.status).json({
          timestamp: new Date().toISOString(),
          message: err.message,
        });
      } else {
        logger.error(err);
        res.status(500).json({
          timestamp: new Date().toISOString(),
          message:
            "Internal server error occured, please contact the maintainers.",
        });
      }
    }
  };
}
