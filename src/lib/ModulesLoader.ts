import { Db } from "mongodb";
import { AppContext } from "./AppContext.js";
import { Manifest } from "./Manifest.js";
import { ModuleFactory } from "./Module.js";
import { InfinityFramework } from "../types.js";

export async function LoadModules(
  manifest: Manifest,
  appContext: AppContext,
  db: Db
): Promise<InfinityFramework.Module[]> {
  const modules: InfinityFramework.Module[] = [];
  for (const module of manifest.modules) {
    modules.push(await ModuleFactory(module, appContext, db));
  }
  appContext.modules = modules;

  return modules;
}
