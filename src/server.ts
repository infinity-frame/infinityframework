import { LoggerFactory } from "./lib/Logger.js";
import { ManifestFactory } from "./lib/Manifest.js";
import { DbFactory } from "./lib/db.js";
import { AppFactory } from "./lib/App.js";
import { LoadAuthModule } from "./lib/auth/index.js";
import { Module, ModuleFactory } from "./lib/Module.js";
import { AppContext } from "./lib/AppContext.js";

/** Server entrypoint */

(async () => {
  const logger = LoggerFactory();

  const manifest = ManifestFactory();
  const database = await DbFactory(manifest, logger);

  const appContext = new AppContext();
  const modules: Module[] = [];
  for (const module of manifest.modules) {
    modules.push(await ModuleFactory(module, appContext, database.db));
  }
  appContext.modules = modules;

  const auth = await LoadAuthModule(database.db, logger);

  const app = AppFactory(manifest, modules, auth, logger);

  appContext.events.emit("initialized");
  logger.info(`InfinityFramework initialization complete`);
})();
