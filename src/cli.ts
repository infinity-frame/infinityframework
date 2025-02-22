import { select } from "@inquirer/prompts";
import { LoadAuthCli } from "./lib/auth/index.js";
import { DbFactory } from "./lib/db.js";
import { pino } from "pino";
import { ManifestFactory } from "./lib/Manifest.js";

/** CLI entrypoint */

(async () => {
  const logger = pino({ transport: { target: "pino-pretty" } });
  const manifest = ManifestFactory();

  const { db, closeClient } = await DbFactory(manifest, logger);

  const cliOption = await select({
    message: "Select a CLI",
    choices: [{ name: "Auth CLI", value: "auth" }],
  });

  switch (cliOption) {
    case "auth":
      await (
        await LoadAuthCli(db)
      )();
      break;
    default:
      console.error("No CLI option specified");
      break;
  }

  await closeClient();
  return;
})();
