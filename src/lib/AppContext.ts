import { EventEmitter } from "node:events";
import { Module } from "./Module.js";
import { Manifest } from "./Manifest.js";

export class AppContext {
  public modules: Module[];
  public events: EventEmitter;
  public readonly name: string;

  constructor(manifest: Manifest) {
    this.name = manifest.name;
    this.modules = [];
    this.events = new EventEmitter();
  }
}
