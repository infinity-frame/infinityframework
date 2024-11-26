import { Manifest } from "./models/Manifest";

export class App {
  manifest: Manifest;

  /** Initializes the app, reading the manifest file from root of the project if manifestPath isn't specified. */
  constructor(manifestPath?: string) {
    this.manifest = new Manifest(manifestPath);
  }
}
