import { select } from "@inquirer/prompts";
import { LoadAuthCli } from "./lib/auth/index.js";
import { DbFactory } from "./lib/Database.js";
import { pino } from "pino";
import { ManifestFactory } from "./lib/Manifest.js";
import { AppContext } from "./lib/AppContext.js";
import { Module, ModuleFactory } from "./lib/Module.js";
import { LoadModules } from "./lib/ModulesLoader.js";

/** CLI entrypoint */

(async () => {
  const logger = pino({ transport: { target: "pino-pretty" } });
  const manifest = ManifestFactory();

  const { db, closeClient } = await DbFactory(manifest, logger);

  const appContext = new AppContext(manifest);
  await LoadModules(manifest, appContext, db);

  const cliOption = await select({
    message: "Select a CLI",
    choices: [{ name: "Auth CLI", value: "auth" }],
  });

  switch (cliOption) {
    case "auth":
      await (
        await LoadAuthCli(db, appContext)
      )();
      break;
    default:
      console.error("No CLI option specified");
      break;
  }

  await closeClient();
  return;
})();
