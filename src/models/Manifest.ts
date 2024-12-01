import { readFileSync } from "node:fs";
import { resolve } from "path";
import logger from "../lib/logger";
import { Module, ModuleType } from "./Module";

interface Configs<T> {
  npm: T[];
  local: T[];
}

export class Manifest {
  name: string;
  modules: Configs<Module>;

  constructor(manifestPath?: string) {
    manifestPath = resolve(manifestPath ?? "manifest.json");

    let manifestRaw = readFileSync(manifestPath, "utf-8");
    let manifest = JSON.parse(manifestRaw);
    if (!(manifest instanceof Object)) {
      throw new Error("Incorrect manifest data type");
    }

    if (!(typeof manifest.name === "string")) {
      throw new Error("Invalid app name");
    }
    this.name = manifest.name;

    this.modules = {
      npm: [],
      local: [],
    };

    if (
      !(manifest.modules instanceof Object) ||
      (!(manifest.npm instanceof Object) &&
        !(manifest.local instanceof Object)) ||
      ((Object.keys(manifest.npm).length === 0) && (Object.keys(manifest.local).length === 0))
    ) {


      logger.warn("No modules defined in manifest");
      return;
    }
  
    const modules = manifest.modules as Configs<unknown>;

    for (const moduleKey in modules.npm) {
      const module = new Module(
        moduleKey,
        ModuleType.NPM,
        modules.npm[moduleKey]
      );
      this.modules.npm.push(module);
    }

    for (const moduleKey in modules.local) {
      const module = new Module(
        moduleKey,
        ModuleType.LOCAL,
        modules.local[moduleKey]
      );
      this.modules.local.push(module);
    }
  }
}
