import { LoggerFactory } from "./lib/Logger.js";
import { ManifestFactory } from "./lib/Manifest.js";
import { DbFactory } from "./lib/Database.js";
import { AppFactory } from "./lib/App.js";
import { LoadAuthModule } from "./lib/auth/index.js";
import { Module, ModuleFactory } from "./lib/Module.js";
import { AppContext } from "./lib/AppContext.js";
import { LoadModules } from "./lib/ModulesLoader.js";

/** Server entrypoint */

(async () => {
  const logger = LoggerFactory();

  const manifest = ManifestFactory();
  const { db } = await DbFactory(manifest, logger);

  const appContext = new AppContext(manifest);
  const modules = await LoadModules(manifest, appContext, db);

  const auth = await LoadAuthModule(db, appContext, logger);

  const app = AppFactory(manifest, modules, auth, appContext, logger);

  appContext.events.emit("initialized");
  logger.info(`InfinityFramework initialization complete`);
})();
