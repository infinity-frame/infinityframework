import { manifest } from "./lib/manifest.js";
import logger from "./lib/logger.js";
import { event } from "./lib/eventEmitter.js";
import { EventEmitter } from "events";
await import("./lib/db.js");
import { app } from "./lib/app.js";

interface Options {
  manifestPath?: string;
  dbUri?: string;
}

export class Core {
  public readonly event: EventEmitter;

  /** Initializes the app, reading the manifest file from root of the project if manifestPath isn't specified. */
  constructor() {
    this.event = event;

    this.loadModules().then(() => {
      app.finalize();

      logger.info(
        `InfinityFramework initialization complete - app listening on port ${app.port}`
      );
      event.emit("init");
    });
  }

  private async loadModules() {
    const moduleLoader = await import("./lib/moduleLoader.js");

    for (const module in manifest.modules.local) {
      await moduleLoader.load(manifest.modules.local[module]);
    }

    for (const module in manifest.modules.npm) {
      await moduleLoader.load(manifest.modules.local[module]);
    }
  }
}
