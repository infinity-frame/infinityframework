import { readFileSync } from "node:fs";
import { resolve } from "path";
import { ManifestInitializationException } from "./Exceptions.js";

interface ManifestInput {
  name?: unknown;
  port?: unknown;
  dbUri?: unknown;
  origin?: unknown;
  modules?: unknown;
  views?: unknown;
}

interface ModuleDeclarationInput {
  source?: unknown;
  name?: unknown;
}

export interface ModuleDeclaration {
  source: string;
  name: string;
}

interface ViewDeclarationInput {
  path?: unknown;
  view?: unknown;
  context?: unknown;
}

export interface ViewDeclaration {
  path: string;
  view: string;
  context: Array<string>;
}

export interface Manifest {
  name: string;
  port: number;
  dbUri: string;
  origin: string;
  modules: ModuleDeclaration[];
  views: ViewDeclaration[];
}

function loadViewDeclaration(
  viewDeclarationInput: ViewDeclarationInput,
  index: number
): ViewDeclaration {
  if (typeof viewDeclarationInput.path !== "string")
    throw new ManifestInitializationException(
      `Invalid path data type on view declaration ${index}`
    );
  if (typeof viewDeclarationInput.view !== "string")
    throw new ManifestInitializationException(
      `Invalid view data type on view declaration ${index}`
    );

  let context: string[] = [];
  if (typeof viewDeclarationInput.context !== "undefined") {
    if (
      !(viewDeclarationInput.context instanceof Array) ||
      viewDeclarationInput.context.some(
        (contextKey) => typeof contextKey !== "string"
      )
    )
      throw new ManifestInitializationException(
        `Invalid context data type on view declaration ${index}`
      );

    context = viewDeclarationInput.context;
  }

  return {
    path: viewDeclarationInput.path,
    view: viewDeclarationInput.view,
    context,
  };
}

function loadModuleDeclaration(
  moduleDeclarationInput: ModuleDeclarationInput,
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

// Could be improved by a factory that generates a function that iterates over an array
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

function loadViewDeclarations(
  viewDeclarationsInput: Array<unknown>
): ViewDeclaration[] {
  const viewDeclarations: ViewDeclaration[] = [];

  for (let i = 0; i < viewDeclarationsInput.length; i++) {
    const viewDeclarationInput = viewDeclarationsInput[i];

    if (
      typeof viewDeclarationInput !== "object" ||
      viewDeclarationInput === null
    )
      throw new ManifestInitializationException(
        `View declaration at position ${i} invalid data type ${typeof viewDeclarationInput}`
      );

    viewDeclarations.push(loadViewDeclaration(viewDeclarationInput, i));
  }

  return viewDeclarations;
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

  let dbUri: string | undefined;
  if (typeof manifestInput.dbUri !== "undefined") {
    dbUri = manifestInput.dbUri;
  }

  let modules: ModuleDeclaration[] = [];
  if (typeof manifestInput.modules !== "undefined") {
    if (!(manifestInput.modules instanceof Array))
      throw new ManifestInitializationException(
        "Module declarations not an array"
      );

    modules = loadModuleDeclarations(manifestInput.modules);
  }

  let views: ViewDeclaration[] = [];
  if (typeof manifestInput.views !== "undefined") {
    if (!(manifestInput.views instanceof Array))
      throw new ManifestInitializationException(
        "Views declarations not an array"
      );

    views = loadViewDeclarations(manifestInput.views);
  }

  return {
    name: manifestInput.name,
    modules,
    views,
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
