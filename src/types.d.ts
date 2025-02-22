import { ModuleExports, ModuleSetupContext } from "./lib/Module.ts";

export type ModuleInitializer = (
  context: ModuleSetupContext
) => Promise<ModuleExports>;
