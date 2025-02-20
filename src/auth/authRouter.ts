import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";

const router = Router();

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO
};

router.post(
  "/auth",
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO
  }
);
