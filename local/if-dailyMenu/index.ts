import express, { NextFunction, Request, Response } from "express";
import { ModuleInitializer } from "../../dist/types.js";
import { ObjectId } from "mongodb";

type Item = {
	name: string;
	price: number;
};

type CreateDailyMenu = {
	date: string;
	menu: Item[];
};

type DailyMenu = CreateDailyMenu & {
	_id: string;
};

const isItemArray = (value: unknown): value is Item[] => {
	if (!Array.isArray(value)) return false;
	return value.every(
		(item) =>
			typeof item.name === "string" && typeof item.price === "number"
	);
};

const dailyMenus: DailyMenu[] = [];

const ModuleInitializer: ModuleInitializer = async (context) => {
	const router = express.Router();
	router.use(express.json());

	context.app.events.addListener("initialized", () => {
		context.logger.info(context.app.modules);
	});

	router.get("/ping", (req: Request, res: Response) => {
		res.send("pong");
	});

	router.post("/menu", async (req: Request, res: Response) => {
		if (typeof req.body.date !== "string" || !isItemArray(req.body.menu)) {
			res.status(400).send({ error: "Invalid request body" });
			return;
		}

		const dailyMenu = req.body as CreateDailyMenu;

		const result = await context.collections.dailyMenus.insertOne({
			date: dailyMenu.date,
			menu: dailyMenu.menu,
		} as CreateDailyMenu);

		const insertedDailyMenu = await context.collections.dailyMenus.findOne({
			_id: result.insertedId,
		});

		res.status(201).json(insertedDailyMenu);
	});

	router.get("/menu", async (req: Request, res: Response) => {
		const dailyMenus = await context.collections.dailyMenus
			.find({})
			.toArray();

		res.send(dailyMenus);
	});

	router.delete("/menu/:id", async (req: Request, res: Response) => {
		const dailyMenuId = req.params.id;

		if (!ObjectId.isValid(dailyMenuId)) {
			res.status(400).send({ error: "Invalid ID" });
			return;
		}

		const result = await context.collections.dailyMenus.deleteOne({
			_id: new ObjectId(dailyMenuId),
		});

		if (result.deletedCount === 0) {
			res.status(404).send({ error: "Daily menu not found" });
		}

		res.status(204).end();
	});

	return {
		router,
		methods: {},
		contexts: {},
	};
};

export default ModuleInitializer;
