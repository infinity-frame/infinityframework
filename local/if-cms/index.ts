import express, { Request, Response, NextFunction } from "express";
import { ModuleInitializer } from "../../dist/types.js";
import { ObjectId } from "mongodb";

/**
 * Class representing a content block.
 */
class ContentBlock {
	_id?: ObjectId;
	elementId: string;
	description?: string;
	content: string;

	/**
	 * Creates a new content block.
	 * @param {string} elementId - The ID of the element.
	 * @param {string} content - The content of the block.
	 * @param {string} [description] - The description of the block.
	 */
	constructor(elementId: string, content: string, description?: string) {
		this.elementId = elementId;
		this.content = content;
		this.description = description;
	}

	/**
	 * Saves the content block to the database.
	 * @param {any} context - The application context.
	 * @returns {Promise<ContentBlock>} - The saved content block.
	 */
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

	/**
	 * Retrieves all content blocks from the database.
	 * @param {any} context - The application context.
	 * @returns {Promise<ContentBlock[]>} - An array of content blocks.
	 */
	static async getAll(context: any) {
		return await context.collections.contentBlocks.find({}).toArray();
	}

	/**
	 * Deletes a content block by its ID.
	 * @param {any} context - The application context.
	 * @param {string} id - The ID of the content block to delete.
	 * @returns {Promise<{deletedCount: number}>} - The result of the deletion.
	 */
	static async delete(context: any, id: string) {
		return await context.collections.contentBlocks.deleteOne({
			_id: new ObjectId(id),
		});
	}
}

/**
 * Module initializer function to set up routes and scheduled tasks.
 * @param {any} context - The application context.
 * @returns {Promise<{router: express.Router, methods: {}, contexts: {}}>} - The initialized module.
 */
const moduleInitializer: ModuleInitializer = async (context) => {
	const router = express.Router();
	router.use(express.json());

	/**
	 * GET /ping
	 * Responds with "pong" to indicate the server is running.
	 */
	router.get("/ping", (req: Request, res: Response) => {
		res.send("pong");
	});

	/**
	 * POST /contentBlock
	 * Creates a new content block.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 */
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

	/**
	 * GET /contentBlock
	 * Retrieves all content blocks.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 */
	router.get("/contentBlock", async (req: Request, res: Response) => {
		const contentBlocks = await ContentBlock.getAll(context);

		res.status(200).json(contentBlocks);
	});

	/**
	 * DELETE /contentBlock/:id
	 * Deletes a content block by its ID.
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 */
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
