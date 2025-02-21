import { NextFunction, Request, Response, RequestHandler } from "express";
import { AuthWebController } from "../controllers/AuthWebController.js";
import { isHttpError } from "http-errors";
import logger from "../../lib/logger.js";

export function AuthMiddlewareFactory(
  authController: AuthWebController
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authController.authorize(req, res);
      next();
    } catch (err) {
      if (isHttpError(err) && err.status === 401) {
        res.status(401).json({
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
