import express from "npm:express";
import "npm:dotenv/config";
import { coreInt } from "./index.d.ts";
import { log, error } from "./utils/logger.ts";
const port = 3000;

const init = (manifestPath?: string) => {
  manifestPath = manifestPath || "manifest.json";
  let manifestRaw: string, manifest: object;

  try {
    manifestRaw = Deno.readTextFileSync(manifestPath);
    manifest = JSON.parse(manifestRaw);
  } catch (err) {
    error("Failed to initialize the app: reading the manifest", "CORE");
    error(err, "CORE");
    Deno.exit(1);
  }

  log(manifest, "CORE");

  const app = express();
  app.listen(port);
  log(`App listening on ${port}`, "CORE");
};

const core: coreInt = { init };

export default core;
