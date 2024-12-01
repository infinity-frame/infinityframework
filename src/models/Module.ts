import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export enum ModuleType {
  NPM,
  LOCAL,
}

export class Module {
  path: string;

  constructor(name: string, type: ModuleType, config?: unknown) {
    if (type === ModuleType.NPM) {
      this.path = resolve("node_modules", name, "modconfig.json");
    } else if (type === ModuleType.LOCAL) {
      this.path = resolve("local", name, "modconfig.json");
    } else {
      throw new Error("Invalid module type");
    }

    const moduleConfigRaw = readFileSync(this.path, { encoding: "utf-8" });
  }
}
