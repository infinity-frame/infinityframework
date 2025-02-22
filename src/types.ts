import { ModuleExports, ModuleSetupContext } from "./lib/Module.js";

export type ModuleInitializer = (
  context: ModuleSetupContext
) => Promise<ModuleExports>;
