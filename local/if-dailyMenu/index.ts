import express, { NextFunction, Request, Response } from "express";
import { ModuleInitializer } from "../../dist/types.js";

type Item = {
  name: string;
  price: number;
};

type DailyMenu = {
  id: string;
  date: string;
  menu: Item[];
};

const dailyMenus: DailyMenu[] = [];

const moduleInitializer: ModuleInitializer = async (context) => {
  const router = express.Router();
  router.use(express.json());

  context.app.events.addListener("initialized", () => {
    context.logger.info(context.app.modules);
  });

  router.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.send("pong");
  });

  router.post("/menu", async (req: Request, res: Response) => {
    if (
      typeof req.body.date !== "string" ||
      typeof req.body.menu !== "object"
    ) {
      res.status(400).send({ error: "Invalid request body" });
      return;
    }

    const dailyMenu: DailyMenu = {
      id: Math.random().toString(36),
      date: req.body.date,
      menu: req.body.menu,
    };

    dailyMenus.push(dailyMenu);

    res.status(201).json(dailyMenu);
  });

  router.get("/menu", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(dailyMenus);
  });

  return {
    router,
    methods: {},
    contexts: {},
  };
};

export default moduleInitializer;
