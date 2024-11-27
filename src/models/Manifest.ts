import { IFError } from "./IFError";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "path";

export class Manifest {
  name: string;

  constructor(manifestPath?: string) {
    manifestPath = resolve(manifestPath ?? "manifest.json");

    let manifestRaw = readFileSync(manifestPath, "utf-8");
    let manifest = JSON.parse(manifestRaw);
    if (!(manifest instanceof Object)) {
      throw new Error("Incorrect manifest data type");
    }

    if (!(typeof manifest.name === "string")) {
      throw new Error("Invalid app name.");
    }
    this.name = manifest.name;

    if (!manifest.modules) {
    }
  }
}
