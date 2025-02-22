import express, { ErrorRequestHandler, Router } from "express";
import { Manifest } from "./Manifest.js";
import { Auth } from "./auth/index.js";
import cors from "cors";
import { Logger } from "pino";
import { Module } from "./Module.js";
import createHttpError, { isHttpError } from "http-errors";
import { NextFunction, Request, Response } from "express";
import { AppContext } from "./AppContext.js";
import {
  AppConfiguration,
  AppConfigurationFactory,
} from "./AppConfiguration.js";

function registerModuleRouter(router: Router, module: Module) {
  router.use(
    `/${module.config.vendor}/${module.config.name}`,
    module.exports.router
  );
}

function DefaultErrorHandlerFactory(logger: Logger): ErrorRequestHandler {
  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (isHttpError(err) && err.expose) {
      res.status(err.status).json(err);
    } else {
      logger.error(
        err,
        "InfinityFramework default error handler caught an unexpected error."
      );
      res.status(500).json({
        message:
          "Internal server error occured, please contact the maintainers of the site.",
      });
    }
  };
}

function registerAppConfigurationRoute(
  router: Router,
  appConfiguration: AppConfiguration
) {
  router.get(
    "/configuration",
    (req: Request, res: Response, next: NextFunction) => {
      res.json(appConfiguration);
    }
  );
}

function APIRouterFactory(
  modules: Module[],
  auth: Auth,
  appConfiguration: AppConfiguration,
  logger: Logger
): Router {
  const router = Router();

  router.use("/auth", auth.router);
  router.use(auth.middleware);
  registerAppConfigurationRoute(router, appConfiguration);

  for (const module of modules) {
    registerModuleRouter(router, module);
  }

  // 404
  router.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found."));
  });

  router.use(DefaultErrorHandlerFactory(logger));

  return router;
}

/** Primary initializer */
export function AppFactory(
  manifest: Manifest,
  modules: Module[],
  auth: Auth,
  appContext: AppContext,
  logger: Logger
) {
  const app = express();

  app.use(cors({ origin: manifest.origin }));

  const appConfiguration: AppConfiguration =
    AppConfigurationFactory(appContext);
  app.use("/api", APIRouterFactory(modules, auth, appConfiguration, logger));

  app.listen(manifest.port);
  logger.info(`App listening on ${manifest.port}`);

  return app;
}
