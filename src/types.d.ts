import { Collection } from "mongodb";
import { Logger } from "pino";
import { Router } from "express";
import EventEmitter from "node:events";

declare namespace InfinityFramework {
  export type ModuleInitializer = (
    context: ModuleSetupContext
  ) => Promise<ModuleExports>;

  export interface ModuleCollections {
    [declaredName: string]: Collection;
  }

  export interface ModuleSetupContext {
    logger: Logger;
    collections: ModuleCollections;
    app: AppContext;
  }

  export interface ModuleExports {
    router: Router;
    methods: {
      [methodName: string]: Function;
    };
    contexts: {
      [contextKey: string]: Function;
    };
  }

  export interface ModuleConfiguration {
    collections: string[];
    name: string;
    vendor: string;
  }

  export interface Module {
    config: ModuleConfiguration;
    exports: ModuleExports;
    path: string;
  }

  export interface AppContext {
    modules: Module[];
    events: EventEmitter;
    readonly name: string;
  }
}
