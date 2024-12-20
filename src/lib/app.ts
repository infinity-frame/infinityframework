import express, { Application, Router } from "express";
import { Module } from "../models/Module.js";

class App {
  public readonly port: number;
  private app: Application;

  constructor() {
    if (
      typeof process.env.IF_PORT !== "string" ||
      isNaN(parseInt(process.env.IF_PORT))
    ) {
      throw new Error("App initialization error - port not defined");
    }
    this.port = parseInt(process.env.IF_PORT);

    this.app = express();
  }

  public finalize() {
    this.app.listen(this.port);
  }

  public registerRouter(router: Router, module: Module) {
    this.app.use(`/api/${module.vendor}/${module.name}`, router);
  }
}

export const app = new App();
