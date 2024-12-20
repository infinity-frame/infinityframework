import { resolve } from "path";
import { Module } from "../models/Module.js";
import {
  globalContext,
  moduleContextProvider,
  validateModulePublic,
  ModulePublic,
} from "./contextProvider.js";
import logger from "./logger.js";
import { Router } from "express";
import { app } from "./app.js";

interface ModuleOutput {
  /** Express router to be mounted to the API path */
  router?: Router;
  /** Public functions exposed to all other modules for safe accesing of module's functionality and data */
  exports?: ModulePublic;
}

export async function load(module: Module) {
  const index = await import(`file://${resolve(module.path, "index.js")}`);
  if (!(index.default instanceof Function)) {
    throw new Error(
      `Invalid data type of module ${module.fullName}'s index file.`
    );
  }

  const moduleContext = new moduleContextProvider(module);
  const output = index.default(globalContext, moduleContext);

  if (typeof output === "undefined") {
    logger.warn(`Module ${module.fullName} hasn't exported`);
    return;
  }

  if (!validateModuleOutput(output, module)) {
    throw new Error(
      `Module loader error - ${module.fullName} output is not a valid ModuleOutput`
    );
  }

  if (typeof output.router !== "undefined") {
    app.registerRouter(output.router, module);
  }

  if (typeof output.exports !== "undefined") {
    globalContext.registerExports(output.exports, module);
  }
}

/** Checks the validity of moduleOutput, throws if invalid */
function validateModuleOutput(
  output: any,
  module: Module
): output is ModuleOutput {
  if (!(output instanceof Object)) {
    throw new Error(
      `Module loader output validation error - ${module.fullName} output is not a valid ModuleOutput`
    );
  }

  if (
    !(output.router instanceof Router) &&
    typeof output.error !== "undefined"
  ) {
    throw new Error(
      `Module loader output validation error - ${module.fullName} router not an expressjs router`
    );
  }

  if (typeof output.exports !== "undefined") {
    if (!validateModulePublic(output.exports, module)) {
      throw new Error(
        `Module loader output validation error - ${module.fullName} public exports not valid`
      );
    }
  }

  return true;
}
