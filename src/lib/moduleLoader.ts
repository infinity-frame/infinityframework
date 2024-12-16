import { resolve } from "path";
import { Module } from "../models/Module.js";
import context from "./contextProvider.js";

export async function load(module: Module) {
  const index = await import(`file://${resolve(module.path, "index.js")}`);
  if (!(index.default instanceof Function)) {
    throw new Error(
      `Invalid data type of module ${module.fullName}'s index file.`
    );
  }

  index.default(context);
}
