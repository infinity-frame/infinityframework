import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import logger from "../lib/logger.js";
import semver from "semver";

export enum ModuleType {
  NPM,
  LOCAL,
}

interface ModuleConfig {
  label: string | null;
  config?: object | null;
  version: string;
  collections?: string[];
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
  public version: string;
  /** Contains optional configuration logic of the module. */
  public config: Object | undefined;
  /** Path of the module's root folder */
  public path: string;
  /** Path to the modconfig.json file */
  private configPath: string;
  /** Collections as defined in the module configuration file */
  public collections: string[];

  constructor(name: string, type: ModuleType, config?: unknown) {
    if (name.split(".").length !== 2) {
      throw new Error(`Module ${name} init error - invalid name ${name}`);
    }
    this.fullName = name;
    this.name = name.split(".")[1];
    this.vendor = name.split(".")[0];

    if (type === ModuleType.NPM) {
      this.path = resolve("node_modules", name);
      this.configPath = resolve("node_modules", name, "modconfig.json");
    } else if (type === ModuleType.LOCAL) {
      this.path = resolve("local", name);
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

    this.version = moduleConfig.version;

    if (typeof moduleConfig.label === "string") {
      this.label = moduleConfig.label;
    }

    if (
      typeof moduleConfig.collections !== "undefined" &&
      moduleConfig.collections.length > 0
    ) {
      this.collections = moduleConfig.collections;
    } else {
      this.collections = [];
    }
  }

  /** Throws an error if not valid, otherwise returns true. */
  private validateModuleConfig(obj: any): obj is ModuleConfig {
    if (!(obj instanceof Object)) {
      throw new Error(
        `Module ${this.fullName} configuration validation error - file is not an object.`
      );
    }

    if (typeof obj.version !== "string" && semver.valid(obj.version)) {
      throw new Error(
        `Module ${this.fullName} configuration validation error - missing version.`
      );
    }

    if (typeof obj.label !== "string" && typeof obj.label !== "undefined") {
      throw new Error(
        `Module ${this.fullName} configuration validation error - label invalid data type.`
      );
    }

    if (!(obj.config instanceof Object) && typeof obj.config !== "undefined") {
      throw new Error(
        `Module ${this.fullName} configuration validation error - config invalid data type.`
      );
    }

    const collections = obj.collections as Array<any>;
    if (
      !(collections instanceof Array) &&
      typeof obj.collections !== "undefined"
    ) {
      throw new Error(
        `Module ${this.fullName} configuration validation error - collections invalid data type.`
      );
    }

    if (collections instanceof Array) {
      if (!collections.some((item) => typeof item === "string")) {
        throw new Error(
          `Module ${this.fullName} configuration validation error - collections invalid data type.`
        );
      }
    }

    return true;
  }
}
