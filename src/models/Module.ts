import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Version } from "../lib/version.js";
import logger from "../lib/logger.js";

export enum ModuleType {
  NPM,
  LOCAL,
}

interface ModuleConfig {
  label: string | null;
  config?: object | null;
  version: string;
}

export class Module {
  /** Qualified name of the module, used for referencing. */
  public fullName: String;
  /** Machine name of the module, second part of the `fullName` used for referencing. */
  public name: String;
  /** Machine name of the vendor of the module, first part of the `fullName` used for referencing. */
  public vendor: String;
  /** Human readable name of the module, used for displaying. */
  public label: String | undefined;
  /** Version object containing numerical properties `major`, `minor` and `patch` as per conventional versioning. */
  public version: Version;
  /** Contains optional configuration logic of the module. */
  public config: Object | undefined;
  private configPath: string;

  constructor(name: string, type: ModuleType, config?: unknown) {
    if (name.split(".").length !== 2) {
      throw new Error(`Module ${name} init error - invalid name ${name}`);
    }
    this.fullName = name;
    this.name = name.split(".")[1];
    this.vendor = name.split(".")[0];

    if (type === ModuleType.NPM) {
      this.configPath = resolve("node_modules", name, "modconfig.json");
    } else if (type === ModuleType.LOCAL) {
      this.configPath = resolve("local", name, "modconfig.json");
    } else {
      throw new Error("Invalid module type");
    }

    const moduleConfig = JSON.parse(
      readFileSync(this.configPath, { encoding: "utf-8" })
    );
    if (!this.validateModuleConfig(moduleConfig)) {
      throw new Error(
        `Undefined error occured during module ${this.fullName}'s validation.`
      );
    }

    this.version = new Version(moduleConfig.version);

    if (typeof moduleConfig.label === "string") {
      this.label = moduleConfig.label;
    }
  }

  /** Throws an error if not valid, otherwise returns true. */
  private validateModuleConfig(obj: any): obj is ModuleConfig {
    if (!(obj instanceof Object)) {
      throw new Error(
        `Module ${this.fullName} configuration validation error - file is not an object.`
      );
    }

    if (typeof obj.version !== "string") {
      throw new Error(
        `Module ${this.fullName} configuration validation error - missing version.`
      );
    }

    if (typeof obj.label !== "string" && typeof obj.label !== "undefined") {
      throw new Error(
        `Module ${this.fullName} configuration validation error - label invalid data type.`
      );
    }

    if (!(obj.config instanceof Object) && typeof obj.label !== "undefined") {
      throw new Error(
        `Module ${this.fullName} configuration validation error - config invalid data type.`
      );
    }

    return true;
  }
}
