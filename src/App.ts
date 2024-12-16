import { Manifest } from "./models/Manifest.js";
import logger from "./lib/logger.js";

interface Options {
  manifestPath?: string;
  dbUri?: string;
}

export class App {
  private options: Options;
  private manifest: Manifest;
  private dbUri: string;

  /** Initializes the app, reading the manifest file from root of the project if manifestPath isn't specified. */
  constructor(options?: { manifestPath?: string; dbUri?: string }) {
    this.options = options ?? {};

    if (this.options && this.options.dbUri) {
      this.dbUri = this.options.dbUri;
    } else {
      this.dbUri = "mongodb://localhost:27017";
    }

    if (!process.env.IF_DBURI) {
      process.env.IF_DBURI = this.dbUri;
    }
    import("./lib/db.js");

    try {
      this.manifest = new Manifest(this.options.manifestPath);
    } catch (error) {
      logger.error(error, "Error occured while instantiating manifest.");
      throw error;
    }
  }
}
