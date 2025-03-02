import express, { Request, Response } from "express";
import { ModuleInitializer } from "../../dist/types.js";
import { ObjectId } from "mongodb";
import cron from "node-cron";
import { format } from "date-fns";

type Item = {
	name: string;
	price: number;
};

type CreateDailyMenu = {
	date: string;
	menu: Item[];
	today: boolean;
};

/**
 * Type guard to check if a value is an array of Item objects.
 * @param {unknown} value - The value to check.
 * @returns {value is Item[]} - True if the value is an array of Item objects, false otherwise.
 */
const isItemArray = (value: unknown): value is Item[] => {
	if (!Array.isArray(value)) return false;
	return value.every(
		(item) =>
			typeof item.name === "string" && typeof item.price === "number"
	);
};

/**
 * Module initializer function to set up routes and scheduled tasks.
 * @param {any} context - The application context.
 * @returns {Promise<{router: express.Router, methods: {}, contexts: {}}>} - The initialized module.
 */
const moduleInitializer: ModuleInitializer = async (context) => {
	const router = express.Router();
	router.use(express.json());

	// Log the initialized modules
	context.app.events.addListener("initialized", () => {
		context.logger.info(context.app.modules);
	});

	/**
	 * GET /ping
	 * Responds with "pong" to indicate the server is running.
	 */
	router.get("/ping", (req: Request, res: Response) => {
		res.send("pong");
	});

	/**
	 * POST /menu
	 * Creates a new daily menu.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 */
	router.post("/menu", async (req: Request, res: Response) => {
		if (typeof req.body.date !== "string" || !isItemArray(req.body.menu)) {
			res.status(400).send({ error: "Invalid request body" });
			return;
		}

		const dailyMenu = req.body as CreateDailyMenu;

		let checkToday = false;
		if (dailyMenu.date === format(new Date(), "dd.MM.yyyy")) {
			checkToday = true;
		}

		const result = await context.collections.dailyMenus.insertOne({
			date: dailyMenu.date,
			menu: dailyMenu.menu,
			today: checkToday,
		} as CreateDailyMenu);

		const insertedDailyMenu = await context.collections.dailyMenus.findOne({
			_id: result.insertedId,
		});

		res.status(201).json(insertedDailyMenu);
	});

	/**
	 * GET /menu
	 * Retrieves all daily menus.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 */
	router.get("/menu", async (req: Request, res: Response) => {
		const dailyMenus = await context.collections.dailyMenus
			.find({})
			.toArray();

		res.status(200).send(dailyMenus);
	});

	/**
	 * DELETE /menu/:id
	 * Deletes a daily menu by its ID.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 */
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

	/**
	 * Schedule a task to run every day at midnight to update the "today" field for daily menus.
	 */
	cron.schedule("0 0 * * *", async () => {
		const todayDate = format(new Date(), "dd.MM.yyyy");

		const result = await context.collections.dailyMenus.updateMany(
			{ date: todayDate },
			{ $set: { today: true } }
		);

		context.logger.info(`Updated ${result.modifiedCount} menus for today.`);
	});

	return {
		router,
		methods: {},
		contexts: {},
	};
};

export default moduleInitializer;
