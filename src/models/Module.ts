import { lstatSync } from "node:fs";
import { resolve } from "node:path";

export enum ModuleType {
  NPM,
  LOCAL,
}

export class Module {
  path: string;

  constructor(name: string, type: ModuleType, config?: unknown) {
    if (type === ModuleType.NPM) {
      this.path = resolve("node_modules", name);
    } else if (type === ModuleType.LOCAL) {
      this.path = resolve("local", name);
    } else {
      throw new Error("Invalid module type");
    }

    if (lstatSync(this.path).isDirectory() === true) {
      throw new Error(`${ModuleType.LOCAL ? "Local" : "NPM"} module ${name} not found`)
    }
  }
}
