import { Db } from "mongodb";
import { AppContext } from "./AppContext.js";
import { Manifest } from "./Manifest.js";
import { Module, ModuleFactory } from "./Module.js";

export async function LoadModules(
  manifest: Manifest,
  appContext: AppContext,
  db: Db
): Promise<Module[]> {
  const modules: Module[] = [];
  for (const module of manifest.modules) {
    modules.push(await ModuleFactory(module, appContext, db));
  }
  appContext.modules = modules;

  return modules;
}
