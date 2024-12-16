import { EventEmitter } from "stream";
import { Module } from "../models/Module.js";
import { Db } from "mongodb";

interface Modules {
  [key: string]: Module;
}

interface ModuleExports {
  [key: string]: {
    [key: string]: Function;
  };
}

/** Provides context (db, list of installed modules, public functions of these modules etc.). */
class contextProvider {
  /** Events interface of the framework. */
  public event: EventEmitter;
  public modules: Modules;
  public moduleExports: ModuleExports;
  // public db: Db;

  constructor() {
    this.event = new EventEmitter();
    this.modules = {};
    this.moduleExports = {};
    // this.db =
  }
}

const provider = new contextProvider();
export default provider;
