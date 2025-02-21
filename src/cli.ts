#!/usr/bin/env node
import { select } from "@inquirer/prompts";
import { LoadAuthCli } from "./auth/index.js";
import { closeDbClient, db } from "./lib/db.js";

(async () => {
  const cliOption = await select({
    message: "Select a CLI",
    choices: [{ name: "Auth CLI", value: "auth" }],
  });

  switch (cliOption) {
    case "auth":
      await LoadAuthCli(db)();
      break;
    default:
      console.error("No CLI option specified");
      break;
  }

  await closeDbClient();
  return;
})();
