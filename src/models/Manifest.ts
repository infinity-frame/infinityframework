import { IFError } from "./IFError";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "path";

export class Manifest {
  name: string;

  constructor(manifestPath?: string) {
    manifestPath = resolve(manifestPath ?? "manifest.json");

    try {
      let manifestRaw = readFileSync(manifestPath, "utf-8");
      let manifest = JSON.parse(manifestRaw);
      if (!(manifest instanceof Object)) {
        throw new Error("Incorrect data type");
      }

      if (!(typeof manifest.name === "string")) {
        throw new Error("Invalid app name.");
      }
      this.name = manifest.name;
    } catch (err) {
      let error = err as Error | undefined;
      throw new IFError({ error, issuer: "INIT" });
    }
  }
}
