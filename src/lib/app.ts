import express, { Application, Router } from "express";
import { Module } from "../models/Module.js";
import cors from "cors";
import logger from "./logger.js";
import { LoadAuthModule } from "../auth/index.js";
import { db } from "./db.js";

class App {
  public readonly port: number;
  private app: Application;
  private apiRouter: Router;

  constructor() {
    if (
      typeof process.env.IF_PORT !== "string" ||
      isNaN(parseInt(process.env.IF_PORT))
    ) {
      throw new Error("App initialization error - port not defined");
    }
    this.port = parseInt(process.env.IF_PORT);

    this.app = express();
    this.apiRouter = Router();

    this.setupRoutes();
  }

  private setupRoutes() {
    this.setupCors();
    this.setupApiRoutes();
  }

  private setupCors() {
    const origin = process.env.IF_ORIGIN || "*";
    if (origin === "*") {
      logger.warn("App running in open CORS mode");
    }

    this.app.use(cors({ origin }));
  }

  private setupApiRoutes() {
    // Auth init
    const auth = LoadAuthModule(db);

    this.apiRouter.use("/auth", auth.router);
    this.apiRouter.use(auth.middleware);

    this.app.use("/api", this.apiRouter);
  }

  public finalize() {
    this.app.listen(this.port);
  }

  public registerRouter(router: Router, module: Module) {
    this.apiRouter.use(`/${module.vendor}/${module.name}`, router);
  }
}

export const app = new App();
