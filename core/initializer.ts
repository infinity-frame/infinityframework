import { Manifest, ModuleConfig } from "./index.d.ts";
import { warn, error, log } from "./utils/logger.ts";
let manifest: Manifest;

export default function initialize(manifestPath: string) {
  let manifestRaw: string;
  try {
    manifestRaw = Deno.readTextFileSync(manifestPath);
    manifest = JSON.parse(manifestRaw);
    validateManifest();
  } catch (err) {
    error("Failed to initialize the app", "CORE-INIT");
    error(err, "CORE-INIT");
  }
}

function validateManifest() {
  validateModules();
}

function validateModules() {
  if (
    !manifest.modules ||
    (!(manifest.modules.local instanceof Object) &&
      !(manifest.modules.npm instanceof Object))
  ) {
    warn(
      "No modules present in Manifest, the app is running barebones functionality"
    );
    return;
  }

  if (manifest.modules.local instanceof Object) {
    for (const moduleName of Object.keys(manifest.modules.local ?? {})) {
      const module = manifest.modules.local[moduleName];
      validateModule(`./local/${moduleName}/`, module);
    }
  }
}

function validateModule(path: string, moduleConfig?: ModuleConfig) {
  log(`Validating module ${path}`);
  log(moduleConfig);
  return;
}
