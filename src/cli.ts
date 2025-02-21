#!/usr/bin/env node
import { select } from "@inquirer/prompts";
import { LoadAuthCli } from "./auth/index.js";
import { DbFactory } from "./lib/db.js";

(async () => {
  const { db, closeClient } = await DbFactory("mongodb://localhost:27017");

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

  await closeClient();
  return;
})();
