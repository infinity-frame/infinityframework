import { Router } from "express";

export enum ModuleType {
  NPM,
  LOCAL,
}

export interface ModuleDeclaration {
  type: ModuleType;
  identifier: string;
}

export interface ModuleConfiguration {
  label?: string;
  version: string;
  config?: object;
  collections?: string[];
}

export interface ModuleExports {
  router: Router;
  methods: { [fnName: string]: Function };
}
