import { EventEmitter } from "node:events";
import { Module } from "./Module.js";

export class AppContext {
  public modules: Module[];
  public events: EventEmitter;

  constructor() {
    this.modules = [];
    this.events = new EventEmitter();
  }
}
