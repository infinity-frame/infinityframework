import { EventEmitter } from "node:events";
import { InfinityFramework } from "../types.js";
import { Manifest } from "./Manifest.js";

export class AppContext implements InfinityFramework.AppContext {
  public modules: InfinityFramework.Module[];
  public events: EventEmitter;
  public readonly name: string;

  constructor(manifest: Manifest) {
    this.name = manifest.name;
    this.modules = [];
    this.events = new EventEmitter();
  }
}
