import express, { NextFunction, Request, Response } from "express";
import { ModuleInitializer } from "../../dist/types.js";

const moduleInitializer: ModuleInitializer = async (context) => {
  const router = express.Router();

  context.app.events.addListener("initialized", () => {
    context.logger.info(context.app.modules);
  });

  router.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.send("pong");
  });

  return {
    router,
    methods: {
      stuff() {
        return [{ something: "else" }];
      },
    },
    // TY 🐄 ONO TO FUNGUJE NA PRVNÍ POKUS!!!!!! 🤓🤓🤓🤓🤓🤓🤓🤓
    contexts: {
      posts: "stuff",
    },
  };
};

export default moduleInitializer;

// export default (globals, module) => {
//   // module.collections.posts.insertOne({
//   //   title: "Sample Title",
//   //   category: "Sample Category",
//   //   content: "I have inserted a document!",
//   // });

//   const router = express.Router();
//   router.use(express.json());

//   router.get("/ping", async (req, res) => {
//     console.log(await globals.exports.if.blog.retrievePosts());

//     res.send("The module is mounted!");
//   });

//   router.post("/post", async (req, res) => {
//     const { title, category, content } = req.body;

//     if (
//       typeof title !== "string" ||
//       typeof category !== "string" ||
//       typeof content !== "string"
//     ) {
//       res.status(400).send("Invalid request body");
//       return;
//     }

//     const result = await module.collections.posts.insertOne({
//       title,
//       category,
//       content,
//     });

//     const insertedPost = await module.collections.posts.findOne({
//       _id: result.insertedId,
//     });

//     res.status(201).json(insertedPost);
//   });

//   router.get("/post", async (req, res) => {
//     const posts = await globals.exports.if.blog.retrievePosts();

//     res.send(posts);
//   });

//   router.delete("/post/:id", async (req, res) => {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//       res.status(400).json({ error: "Invalid ID" });
//       return;
//     }

//     const result = await module.collections.posts.deleteOne({
//       _id: new ObjectId(id),
//     });

//     if (result.deletedCount === 0) {
//       res.status(404).json({ error: "Post not found" });
//       return;
//     }

//     res.status(204).end();
//   });

//   const retrievePosts = async () => {
//     return module.collections.posts.find({}).toArray();
//   };

//   return {
//     router,
//     exports: {
//       retrievePosts,
//     },
//   };
// };
