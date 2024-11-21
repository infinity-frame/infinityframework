import { coreInt } from "./index.d.ts";
import initialize from "./initializer.ts";
import { log } from "./utils/logger.ts";

const init = (manifestPath?: string) => {
  manifestPath = manifestPath || "manifest.json";

  initialize(manifestPath);
  log("App initialized", "CORE");
};

const core: coreInt = { init };

export default core;
