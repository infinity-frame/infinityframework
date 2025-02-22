import { AppContext } from "./AppContext.js";
import { Module } from "./Module.js";

interface ModuleConfigurationView {
  name: string;
  vendor: string;
}

/** Reduced form of AppContext intended for consumption by the admin frontend.  */
export interface AppConfiguration {
  name: string;
  modules: ModuleConfigurationView[];
}

function mapModuleConfigurationView(module: Module): ModuleConfigurationView {
  return {
    name: module.config.name,
    vendor: module.config.vendor,
  };
}

export function AppConfigurationFactory(appContext: AppContext) {
  const moduleConfigurationViews: ModuleConfigurationView[] =
    appContext.modules.map((module) => mapModuleConfigurationView(module));

  return {
    modules: moduleConfigurationViews,
    name: appContext.name,
  };
}
