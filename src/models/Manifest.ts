import { readFileSync } from "node:fs";
import { resolve } from "path";
import logger from "../lib/logger";
import { Module, ModuleType } from "./Module";

interface Configs {
  npm: { [key: string]: any };
  local: { [key: string]: any };
}

/** Conservative interface for maximum security, requires only that the variable is of type Object */
interface UserManifest {
  name?: string;
  modules?: {
    npm: unknown;
    local: unknown;
  };
}

export class Manifest {
  name: string;
  modules: Configs;

  constructor(manifestPath?: string) {
    manifestPath = resolve(manifestPath ?? "manifest.json");

    let manifestRaw = readFileSync(manifestPath, "utf-8");
    let manifestParsed: unknown = JSON.parse(manifestRaw);
    if (!(manifestParsed instanceof Object)) {
      throw new Error("Incorrect manifest data type");
    }
    let manifest = manifestParsed as UserManifest;

    if (!(typeof manifest.name === "string")) {
      throw new Error("Invalid app name");
    }
    this.name = manifest.name;

    this.modules = {
      npm: [],
      local: [],
    };

    if (!(manifest.modules instanceof Object)) {
      logger.warn("No modules defined in manifest");
      return;
    }

    const npmModulesExist =
      manifest.modules.npm instanceof Object &&
      Object.keys(manifest.modules.npm).length !== 0;
    const localModulesExist =
      manifest.modules.local instanceof Object &&
      Object.keys(manifest.modules.local).length !== 0;

    if (!npmModulesExist && !localModulesExist) {
      logger.warn("No modules defined in manifest");
      return;
    }

    const modules: Configs = manifest.modules as Configs;

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
