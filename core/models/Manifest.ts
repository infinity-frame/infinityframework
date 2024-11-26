import { IFError } from "./IFError";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "path";

export class Manifest {
  constructor(manifestPath?: string) {
    manifestPath = manifestPath ?? "manifest.json";

    try {
      if (!existsSync(resolve(manifestPath))) {
        throw new Error("Manifest not found.");
      }
    } catch (err) {
      let error = err as Error | undefined;
      throw new IFError({ error, issuer: "INIT" });
    }
  }
}
