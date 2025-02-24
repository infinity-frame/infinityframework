import express, { NextFunction, Request, Response } from "express";
import { ModuleInitializer } from "../../dist/types.js";
import { setTimeout } from "node:timers/promises";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";

const moduleInitializer: ModuleInitializer = async (context) => {
  const router = express.Router();
  router.use(express.json());

  context.app.events.addListener("initialized", () => {
    context.logger.info(context.app.modules);
  });

  router.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.send("pong");
  });

  router.post("/post", async (req: Request, res: Response) => {
    const body = req.body;

    if (
      typeof body.title !== "string" ||
      typeof body.content !== "string" ||
      typeof body.category !== "string"
    ) {
      res.status(400).send({ error: "Invalid request body" });
      return;
    }

    const result = await context.collections.posts.insertOne({
      title: body.title,
      content: body.content,
      category: body.category,
    });

    const insertedPost = await context.collections.posts.findOne({
      _id: result.insertedId,
    });

    res.status(201).json(insertedPost);
  });

  router.get("/post", async (req: Request, res: Response) => {
    const posts = await context.collections.posts.find({}).toArray();

    res.send(posts);
  });

  router.delete("/post/:postId", async (req: Request, res: Response) => {
    const postId = req.params.postId;

    if (!ObjectId.isValid(postId)) {
      res.status(400).send({ error: "Invalid ID" });
      return;
    }

    const result = await context.collections.posts.deleteOne({
      _id: new ObjectId(postId),
    });

    if (result.deletedCount === 0) {
      res.status(404).send({ error: "Post not found" });
    }

    res.status(204).end();
  });

  return {
    router,
    methods: {
      stuff() {
        return "yup, works";
      },
    },
    contexts: {
      async posts(req: Request) {
        // Extract parameters
        console.log(req.params.postId);

        // Supports asynchronous code
        await setTimeout(1);

        return [{ something: "else" }];
      },
      error() {
        throw createHttpError(404);
      },
    },
  };
};

export default moduleInitializer;
