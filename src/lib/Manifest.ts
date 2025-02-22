import { readFileSync } from "node:fs";
import { resolve } from "path";
import { ManifestInitializationException } from "./Exceptions.js";

interface ManifestInput {
  name?: unknown;
  port?: unknown;
  dbUri?: unknown;
  origin?: unknown;
  modules?: unknown;
}

interface moduleDeclarationInput {
  source?: unknown;
  name?: unknown;
}

export interface ModuleDeclaration {
  source: string;
  name: string;
}

export interface Manifest {
  name: string;
  port: number;
  dbUri: string;
  origin: string;
  modules: ModuleDeclaration[];
}

function loadModuleDeclaration(
  moduleDeclarationInput: moduleDeclarationInput,
  index: number
): ModuleDeclaration {
  if (typeof moduleDeclarationInput.source !== "string")
    throw new ManifestInitializationException(
      `Invalid source data type on module declaration ${index}`
    );
  if (typeof moduleDeclarationInput.name !== "string")
    throw new ManifestInitializationException(
      `Invalid name data type on module declaration ${index}`
    );

  return {
    source: moduleDeclarationInput.source,
    name: moduleDeclarationInput.name,
  };
}

function loadModuleDeclarations(
  moduleDeclarationsInput: Array<unknown>
): ModuleDeclaration[] {
  const moduleDeclarations: ModuleDeclaration[] = [];

  for (let i = 0; i < moduleDeclarationsInput.length; i++) {
    const moduleDeclarationInput = moduleDeclarationsInput[i];
    if (
      typeof moduleDeclarationInput !== "object" ||
      moduleDeclarationInput === null
    )
      throw new ManifestInitializationException(
        `Module declaration at position ${i} invalid data type ${typeof moduleDeclarationInput}`
      );
    moduleDeclarations.push(loadModuleDeclaration(moduleDeclarationInput, i));
  }

  return moduleDeclarations;
}

function parseManifestInput(manifestInput: ManifestInput): Manifest {
  if (typeof manifestInput.name !== "string")
    throw new ManifestInitializationException(
      "App name must be supplied in the Manifest and be a string"
    );

  if (typeof manifestInput.origin !== "string")
    throw new ManifestInitializationException(
      "origin must be supplied in the Manifest and be a string"
    );

  if (typeof manifestInput.dbUri !== "string")
    throw new ManifestInitializationException(
      "dbUri must be supplied in the Manifest and be a string"
    );

  if (typeof manifestInput.port !== "number")
    throw new ManifestInitializationException(
      "port must be supplied in the Manifest and be a number"
    );

  let modules: ModuleDeclaration[] = [];
  if (typeof manifestInput.modules !== "undefined") {
    if (!(manifestInput.modules instanceof Array))
      throw new ManifestInitializationException(
        "Module declarations not an array"
      );

    modules = loadModuleDeclarations(manifestInput.modules);
  }

  let dbUri: string | undefined;
  if (typeof manifestInput.dbUri !== "undefined") {
    dbUri = manifestInput.dbUri;
  }

  return {
    name: manifestInput.name,
    modules,
    dbUri: manifestInput.dbUri,
    port: manifestInput.port,
    origin: manifestInput.origin,
  };
}

export function ManifestFactory(): Manifest {
  const manifestPath = resolve("manifest.json");

  const manifestRaw = JSON.parse(readFileSync(manifestPath, "utf-8"));
  if (typeof manifestRaw !== "object") {
    throw new ManifestInitializationException(
      `Invalid Manifest data type ${typeof manifestRaw}`
    );
  }

  return parseManifestInput(manifestRaw);
}
