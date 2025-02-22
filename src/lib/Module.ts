import { readFileSync } from "node:fs";
import path from "node:path";
import { AppContext } from "./AppContext.js";
import { Collection, Db } from "mongodb";
import { Router } from "express";
import { ModuleDeclaration } from "./Manifest.js";
import { Logger } from "pino";
import { ModuleInitializationException } from "./exceptions.js";
import { ModuleInitializer } from "../types.js";
import { ModuleLoggerFactory } from "./Logger.js";

interface ModuleConfigurationInput {
  collections?: unknown;
  name?: unknown;
  vendor?: unknown;
}

export interface ModuleConfiguration {
  collections: string[];
  name: string;
  vendor: string;
}

interface ModuleCollections {
  [declaredName: string]: Collection;
}

export interface ModuleSetupContext {
  logger: Logger;
  collections: ModuleCollections;
  app: AppContext;
}

export interface ModuleExports {
  router: Router;
  methods: { [fnName: string]: Function };
}

export interface Module {
  config: ModuleConfiguration;
  exports: ModuleExports;
}

function parseModuleConfiguration(
  modConfigInput: ModuleConfigurationInput,
  modulePath: string
): ModuleConfiguration {
  if (typeof modConfigInput.name !== "string")
    throw new ModuleInitializationException(
      `Invalid modconfig name declaration on path ${modulePath}`
    );
  if (typeof modConfigInput.vendor !== "string")
    throw new ModuleInitializationException(
      `Invalid modconfig vendor declaration on path ${modulePath}`
    );

  let collections: string[] = [];
  if (typeof modConfigInput.collections !== "undefined") {
    if (
      !(modConfigInput.collections instanceof Array) ||
      modConfigInput.collections.some(
        (collection) => typeof collection !== "string"
      )
    )
      throw new ModuleInitializationException(
        `Invalid modconfig collections declaration on path ${modulePath}`
      );
    collections = modConfigInput.collections;
  }

  return {
    collections,
    vendor: modConfigInput.vendor,
    name: modConfigInput.name,
  };
}

function loadModuleConfiguration(modulePath: string): ModuleConfiguration {
  const modConfigRaw = JSON.parse(
    readFileSync(path.join(modulePath, "modconfig.json"), "utf-8")
  );
  if (typeof modConfigRaw !== "object")
    throw new ModuleInitializationException(
      `Invalid modconfig data type on path ${modulePath}`
    );

  return parseModuleConfiguration(modConfigRaw, modulePath);
}

function provisionCollection(
  moduleConfiguration: ModuleConfiguration,
  declaredCollectionName: string,
  db: Db
): Collection {
  const collectionName = `${moduleConfiguration.vendor}.${moduleConfiguration.name}.${declaredCollectionName}`;
  const collection = db.collection(collectionName);
  return collection;
}

export async function ModuleFactory(
  declaration: ModuleDeclaration,
  appContext: AppContext,
  db: Db
): Promise<Module> {
  const modulePath = path.resolve(declaration.source, declaration.name);
  const moduleConfiguration = loadModuleConfiguration(modulePath);

  const collections: ModuleCollections = {};
  for (const moduleCollectionDeclaration of moduleConfiguration.collections) {
    collections[moduleCollectionDeclaration] = provisionCollection(
      moduleConfiguration,
      moduleCollectionDeclaration,
      db
    );
  }

  const logger = ModuleLoggerFactory();

  const initializer: ModuleInitializer = (
    await import(`file://${path.join(modulePath, "index.js")}`)
  ).default;
  const exports = await initializer({ app: appContext, logger, collections });

  return {
    config: moduleConfiguration,
    exports,
  };
}
