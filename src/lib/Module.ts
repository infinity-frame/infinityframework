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

// export class Module {
//   /** Qualified name of the module, used for referencing. */
//   public identifier: string;
//   /** Machine name of the module, second part of the `fullName` used for referencing. */
//   public name: string;
//   /** Machine name of the vendor of the module, first part of the `fullName` used for referencing. */
//   public vendor: string;
//   /** Human readable name of the module, used for displaying. */
//   public label: string | undefined;
//   /** Version object containing numerical properties `major`, `minor` and `patch` as per conventional versioning. */
//   public version: string;
//   /** Contains optional configuration logic of the module. */
//   public config: Object | undefined;
//   /** Path of the module's root folder */
//   public path: string;
//   /** Path to the modconfig.json file */
//   private configPath: string;
//   /** Collections as defined in the module configuration file */
//   public collections: Collection[];
//   /** Exports loaded after the load function is called */
//   public exports: ModuleExports | null;

//   constructor(declaration: ModuleDeclaration, private db: Db) {
//     if (declaration.identifier.split(".").length !== 2) {
//       throw new Error(`Module ${name} init error - invalid name ${name}`);
//     }
//     this.identifier = declaration.identifier;
//     this.name = this.identifier.split(".")[1];
//     this.vendor = this.identifier.split(".")[0];

//     if (declaration.type === ModuleType.NPM) {
//       this.path = resolve("node_modules", this.identifier);
//       this.configPath = resolve(
//         "node_modules",
//         this.identifier,
//         "modconfig.json"
//       );
//     } else if (declaration.type === ModuleType.LOCAL) {
//       this.path = resolve("local", this.identifier);
//       this.configPath = resolve("local", this.identifier, "modconfig.json");
//     } else {
//       throw new Error("Invalid module type");
//     }

//     const moduleConfig = JSON.parse(
//       readFileSync(this.configPath, { encoding: "utf-8" })
//     );
//     if (!this.validateModuleConfig(moduleConfig)) {
//       throw new Error(
//         `Undefined error occured during module ${this.identifier}'s validation.`
//       );
//     }

//     this.version = moduleConfig.version;

//     if (typeof moduleConfig.label === "string") {
//       this.label = moduleConfig.label;
//     }

//     if (
//       typeof moduleConfig.collections !== "undefined" &&
//       moduleConfig.collections.length > 0
//     ) {
//       this.collections = this.provisionCollections(moduleConfig.collections);
//     } else {
//       this.collections = [];
//     }

//     this.exports = null;
//   }

//   /** Throws an error if not valid, otherwise returns true. */
//   private validateModuleConfig(obj: any): obj is ModuleConfiguration {
//     // if (!(obj instanceof Object)) {
//     //   throw new Error(
//     //     `Module ${this.identifier} configuration validation error - file is not an object.`
//     //   );
//     // }

//     // if (typeof obj.version !== "string" && semver.valid(obj.version)) {
//     //   throw new Error(
//     //     `Module ${this.identifier} configuration validation error - missing version.`
//     //   );
//     // }

//     // if (typeof obj.label !== "string" && typeof obj.label !== "undefined") {
//     //   throw new Error(
//     //     `Module ${this.identifier} configuration validation error - label invalid data type.`
//     //   );
//     // }

//     // if (!(obj.config instanceof Object) && typeof obj.config !== "undefined") {
//     //   throw new Error(
//     //     `Module ${this.identifier} configuration validation error - config invalid data type.`
//     //   );
//     // }

//     // const collections = obj.collections as Array<any>;
//     // if (
//     //   !(collections instanceof Array) &&
//     //   typeof obj.collections !== "undefined"
//     // ) {
//     //   throw new Error(
//     //     `Module ${this.identifier} configuration validation error - collections invalid data type.`
//     //   );
//     // }

//     // if (collections instanceof Array) {
//     //   if (!collections.some((item) => typeof item === "string")) {
//     //     throw new Error(
//     //       `Module ${this.identifier} configuration validation error - collections invalid data type.`
//     //     );
//     //   }
//     // }

//     return true;
//   }

//   private provisionCollections(collectionNames: string[]): Collection[] {
//     return collectionNames.map((collectionName) =>
//       this.provisionCollection(collectionName)
//     );
//   }

//   private provisionCollection(collectionName: string): Collection {
//     const fullCollectionName = `${this.identifier}.${collectionName}`;
//     return this.db.collection(fullCollectionName);
//   }

//   public async load(globalContext: moduleContextProvider): Promise<void> {
//     const defaultExport = (
//       await import(`file://${resolve(this.path, "index.js")}`)
//     ).default;
//     this.exports = defaultExport();
//   }
// }

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
