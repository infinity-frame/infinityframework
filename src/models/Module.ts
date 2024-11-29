import { existsSync } from "node:fs";
import { resolve } from "node:path";

export enum ModuleType {
  NPM,
  LOCAL,
}

export class Module {
  path: string;

  constructor(name: string, type: ModuleType, config?: unknown) {
    if (type === ModuleType.NPM) {
      this.path = resolve("npm", name);
    } else if (type === ModuleType.LOCAL) {
      this.path = resolve("local", name);
    } else {
      throw new Error("Invalid module type");
    }

    console.log(this.path);

    if (!existsSync(this.path)) {
      throw new Error("Module not found");
    }
  }
}
