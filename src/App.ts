import { manifest } from "./lib/manifest.js";
import logger from "./lib/logger.js";
import { EventEmitter } from "events";
import { app } from "./lib/app.js";
import { Db } from "mongodb";
import { DbFactory } from "./lib/db.js";
import express, { Application } from "express";

class App {
  public readonly events: EventEmitter;
  private readonly port: number;
  public app: Application;

  /** Initializes the app, reading the manifest file from root of the project if manifestPath isn't specified. */
  constructor(private db: Db, port: number) {
    this.events = new EventEmitter();
    this.app = express();
    this.port = port;
  }

  /** Called by the internal AppFactory, do not call as a third-party! */
  public async initialize() {
    await this.loadModules();

    this.app.listen(this.port);
    logger.info(
      `InfinityFramework initialization complete - app listening on port ${this.port}`
    );
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

interface ConfigurationOptions {
  manifestPath?: string;
  dbUri?: string;
  port?: number;
}

/** Primary initializer */
export async function AppFactory(options?: ConfigurationOptions) {
  const dbUri = options?.dbUri || "mongodb://localhost:27017";
  const db = await DbFactory(dbUri);

  const port = options?.port || 3000;

  const app = new App(db.db, port);
  await app.initialize();

  return app;
}
