import express, { ErrorRequestHandler, Router } from "express";
import { Manifest, ViewDeclaration } from "./Manifest.js";
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
  projectAppConfiguration,
} from "./AppConfiguration.js";
import { existsSync } from "fs";
import path from "path";
import { AppInitializationException } from "./Exceptions.js";

function registerModuleRouter(router: Router, module: Module, auth: Auth) {
  router.use(
    `/${module.config.vendor}/${module.config.name}`,
    auth.middleware(`${module.config.vendor}.${module.config.name}`),
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
  appConfiguration: AppConfiguration,
  auth: Auth
) {
  router.get(
    "/configuration",
    auth.middleware(),
    (req: Request, res: Response, next: NextFunction) => {
      res.json(projectAppConfiguration(appConfiguration, req.user.permissions));
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
  registerAppConfigurationRoute(router, appConfiguration, auth);

  for (const module of modules) {
    registerModuleRouter(router, module, auth);
  }

  // 404
  router.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found."));
  });

  router.use(DefaultErrorHandlerFactory(logger));

  return router;
}

function ModuleAssetsRouterFactory(modules: Module[]): Router {
  const router = Router();

  for (const module of modules) {
    if (existsSync(path.join(module.path, "assets/"))) {
      router.use(
        `/${module.config.vendor}/${module.config.name}`,
        express.static(path.join(module.path, "assets/"))
      );
    }
  }

  return router;
}

function ViewContextGetterFactory(
  viewDeclaration: ViewDeclaration,
  appContext: AppContext
) {
  const contextMethodMappings: {
    moduleVendor: string;
    moduleName: string;
    contextIdentifier: string;
    method: Function;
  }[] = [];
  for (const contextKey of viewDeclaration.context) {
    const moduleVendor = contextKey.split(".")[0];
    const moduleName = contextKey.split(".")[1];
    const contextIdentifier = contextKey.split(".")[2];

    if (
      typeof moduleVendor !== "string" ||
      typeof moduleName !== "string" ||
      typeof contextIdentifier !== "string"
    )
      throw new AppInitializationException(
        `Invalid context key format ${contextKey} in view declaration ${viewDeclaration.path}`
      );

    const module = appContext.modules.find(
      (m) => m.config.vendor === moduleVendor && m.config.name === moduleName
    );
    if (typeof module === "undefined")
      throw new AppInitializationException(
        `Module defined in context ${contextKey} not found for view declaration ${viewDeclaration.path}`
      );

    if (typeof module.exports.contexts[contextIdentifier] !== "function")
      throw new AppInitializationException(
        `Module defined in context ${contextKey} doesn't export a function for the provided contextIdentifier \`${contextIdentifier}\`, view declaration ${viewDeclaration.path}`
      );

    contextMethodMappings.push({
      moduleVendor,
      moduleName,
      contextIdentifier,
      method: module.exports.contexts[contextIdentifier],
    });
  }

  return async (req: Request): Promise<object> => {
    const viewContext: { [contextKey: string]: any } = {};

    for (const contextMethodMapping of contextMethodMappings) {
      if (!viewContext[contextMethodMapping.moduleVendor])
        viewContext[contextMethodMapping.moduleVendor] = {};
      if (
        !viewContext[contextMethodMapping.moduleVendor][
          contextMethodMapping.moduleName
        ]
      )
        viewContext[contextMethodMapping.moduleVendor][
          contextMethodMapping.moduleName
        ] = {};

      viewContext[contextMethodMapping.moduleVendor][
        contextMethodMapping.moduleName
      ][contextMethodMapping.contextIdentifier] =
        await contextMethodMapping.method(req);
    }

    return viewContext;
  };
}

function PublicRouterFactory(
  viewDeclarations: ViewDeclaration[],
  appContext: AppContext,
  logger: Logger
): Router {
  const router = Router();

  for (const viewDeclaration of viewDeclarations) {
    const viewContextGetter = ViewContextGetterFactory(
      viewDeclaration,
      appContext
    );
    router.get(
      viewDeclaration.path,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const viewContext = await viewContextGetter(req);
          res.render(viewDeclaration.view, { context: viewContext });
        } catch (err) {
          next(err);
        }
      }
    );
  }

  // 404
  router.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404));
  });

  router.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (isHttpError(err) && err.expose) {
        res.status(404).render("errors/404");
      } else {
        logger.error(
          err,
          "InfinityFramework public error handler caught an unexpected error."
        );
        res.status(500).render("errors/500");
      }
    }
  );

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

  app.use("/static", express.static("public"));
  app.use("/assets", ModuleAssetsRouterFactory(modules));

  app.set("view engine", "ejs");
  app.use("/", PublicRouterFactory(manifest.views, appContext, logger));

  app.listen(manifest.port);
  logger.info(`App listening on ${manifest.port}`);

  return app;
}
