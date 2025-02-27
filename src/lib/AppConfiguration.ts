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

/** Returns a filtered AppConfiguration according to set permissions. */
export const projectAppConfiguration = (
  appConfiguration: AppConfiguration,
  permissions: string[]
): AppConfiguration => {
  if (permissions.includes("global")) {
    return appConfiguration;
  }

  const projectedModules: ModuleConfigurationView[] =
    appConfiguration.modules.filter((module) =>
      permissions.includes(`${module.vendor}.${module.name}`)
    );

  return {
    name: appConfiguration.name,
    modules: projectedModules,
  };
};

export function AppConfigurationFactory(
  appContext: AppContext
): AppConfiguration {
  const moduleConfigurationViews: ModuleConfigurationView[] =
    appContext.modules.map((module) => mapModuleConfigurationView(module));

  return {
    modules: moduleConfigurationViews,
    name: appContext.name,
  };
}
