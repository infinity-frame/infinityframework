import { EventEmitter } from "events";
import { Module } from "../models/Module.js";
import { Collection } from "mongodb";
import { db } from "./db.js";
import { event } from "./eventEmitter.js";
import semver from "semver";

interface ModulesList {
  [key: string]: {
    name: string;
    version: string;
  };
}

interface ModuleExports {
  [vendor: string]: { [module: string]: ModulePublic };
}

export interface ModulePublic {
  [key: string]: Function;
}

/** Validates the public exports of a module, throws if invalid */
export function validateModulePublic(
  exports: unknown,
  module: Module
): exports is ModulePublic {
  if (!(exports instanceof Object)) {
    throw new Error(
      `Module public function validation error - ${module.fullName} exports are not an object`
    );
  }

  let exportsObj = exports as { [key: string]: unknown };

  for (const func in exportsObj) {
    if (!(exportsObj[func] instanceof Function)) {
      throw new Error(
        `Module public function validation error - ${module.fullName} public function ${func} not a function`
      );
    }
  }

  return true;
}

/** Provides global context, meaning events, list of installed modules and their exposed functions */
class globalContextProvider {
  /** Events interface of the framework. */
  public event: EventEmitter;
  public modules: ModulesList;
  public exports: ModuleExports;

  constructor() {
    this.event = event;
    this.modules = {};
    this.exports = {};
  }

  public registerExports(exports: ModulePublic, module: Module) {
    if (typeof this.exports[module.vendor] === "undefined") {
      this.exports[module.vendor] = {};
    }
    this.exports[module.vendor][module.name] = exports;
  }
}

export const globalContext = new globalContextProvider();

/** Provides module-specific context, meaning db and its configuration defined in the manifest file */
export class moduleContextProvider {
  public collections: {
    [key: string]: Collection;
  };
  public configuration: Object;

  constructor(moduleConfig: Module) {
    this.configuration = moduleConfig.config || {};

    this.collections = {};
    for (const collection of moduleConfig.collections) {
      this.collections[collection] = db.collection(
        `${moduleConfig.fullName}.${collection}`
      );
    }
  }
}
