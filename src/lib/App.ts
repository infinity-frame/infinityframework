import express, { Router } from "express";
import { Manifest } from "./Manifest.js";
import { Auth } from "./auth/index.js";
import cors from "cors";
import { Logger } from "pino";
import { Module } from "./Module.js";

function registerModuleRouter(router: Router, module: Module) {
  router.use(
    `/${module.config.vendor}/${module.config.name}`,
    module.exports.router
  );
}

function APIRouterFactory(modules: Module[], auth: Auth): Router {
  const router = Router();

  router.use("/auth", auth.router);
  router.use(auth.middleware);

  for (const module of modules) {
    registerModuleRouter(router, module);
  }

  return router;
}

/** Primary initializer */
export function AppFactory(
  manifest: Manifest,
  modules: Module[],
  auth: Auth,
  logger: Logger
) {
  const app = express();

  app.use(cors({ origin: manifest.origin }));

  app.use("/api", APIRouterFactory(modules, auth));

  app.listen(manifest.port);
  logger.info(`App listening on ${manifest.port}`);

  return app;
}
