import { EventEmitter } from "events";
import { Module } from "./module.js";
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
  [key: string]: {
    [key: string]: Function;
  };
}

/** Provides global context, meaning events, list of installed modules and their exposed functions */
class globalContextProvider {
  /** Events interface of the framework. */
  public event: EventEmitter;
  public modules: ModulesList;
  public moduleExports: ModuleExports;

  constructor() {
    this.event = event;
    this.modules = {};
    this.moduleExports = {};
  }
}

export const globalContext = new globalContextProvider();

/** Provides module-specific context, meaning db and its configuration defined in the manifest file */
export class moduleContextProvider {
  public collections: Collection[];
  public configuration: Object;

  constructor(moduleConfig: Module) {
    this.collections = [];
    this.configuration = {};
  }
}
