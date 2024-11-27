import { Manifest } from "./models/Manifest";
import logger from "./lib/logger";

interface Options {
  manifestPath?: string;
}

export class App {
  options: Options;
  manifest: Manifest;

  /** Initializes the app, reading the manifest file from root of the project if manifestPath isn't specified. */
  constructor(options?: { manifestPath?: string }) {
    this.options = options ?? {};
    try {
      this.manifest = new Manifest(this.options.manifestPath);
    } catch (error) {
      logger.error(error, "Error occured while instantiating manifest.");
      throw error;
    }
  }
}
