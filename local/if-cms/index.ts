import express, { Request, Response, NextFunction } from "express";
import { ModuleInitializer } from "../../dist/types.js";
import { ObjectId } from "mongodb";

class ContentBlock {
	_id?: ObjectId;
	elementId: string;
	description?: string;
	content: string;

	constructor(elementId: string, content: string, description?: string) {
		this.elementId = elementId;
		this.content = content;
		this.description = description;
	}

	saveToDatabase = async (context: any) => {
		const result = await context.collections.contentBlocks.insertOne({
			elementId: this.elementId,
			description: this.description,
			content: this.content,
		});

		this._id = result.insertedId;

		return await context.collections.contentBlocks.findOne({
			_id: this._id,
		});
	};

	static async getAll(context: any) {
		return await context.collections.contentBlocks.find({}).toArray();
	}

	static async delete(context: any, id: string) {
		return await context.collections.contentBlocks.deleteOne({
			_id: new ObjectId(id),
		});
	}
}

const moduleInitializer: ModuleInitializer = async (context) => {
	const router = express.Router();
	router.use(express.json());

	router.get("/ping", (req: Request, res: Response) => {
		res.send("pong");
	});

	router.post("/contentBlock", async (req: Request, res: Response) => {
		const body = req.body;

		if (
			!body.elementId ||
			!body.content ||
			typeof body.elementId !== "string" ||
			typeof body.content !== "string"
		) {
			res.status(400).json({ error: "Invalid request body" });
			return;
		}

		const contentBlock = new ContentBlock(body.elementId, body.content);
		if (
			typeof body.description === "string" &&
			body.description.length > 0
		) {
			contentBlock.description = body.description;
		}

		const insertedContentBlock = await contentBlock.saveToDatabase(context);

		res.status(201).json(insertedContentBlock);
	});

	router.get("/contentBlock", async (req: Request, res: Response) => {
		const contentBlocks = await ContentBlock.getAll(context);

		res.status(200).json(contentBlocks);
	});

	router.delete("/contentBlock/:id", async (req: Request, res: Response) => {
		const contentBlockId = req.params.id;

		if (!ObjectId.isValid(contentBlockId)) {
			res.status(400).json({ error: "Invalid ID" });
			return;
		}

		const result = await ContentBlock.delete(context, contentBlockId);

		if (result.deletedCount === 0) {
			res.status(404).json({ error: "Content block not found" });
			return;
		}

		res.status(204).json();
	});

	return {
		router,
		methods: {},
		contexts: {},
	};
};

export default moduleInitializer;
