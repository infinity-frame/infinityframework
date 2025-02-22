import express from "express";
import { ObjectId } from "mongodb";

export default (globals, module) => {
  // module.collections.posts.insertOne({
  //   title: "Sample Title",
  //   category: "Sample Category",
  //   content: "I have inserted a document!",
  // });

  const router = express.Router();
  router.use(express.json());

  router.get("/ping", async (req, res) => {
    console.log(await globals.exports.if.blog.retrievePosts());

    res.send("The module is mounted!");
  });

  router.post("/post", async (req, res) => {
    const { title, category, content } = req.body;

    if (
      typeof title !== "string" ||
      typeof category !== "string" ||
      typeof content !== "string"
    ) {
      res.status(400).send("Invalid request body");
      return;
    }

    const result = await module.collections.posts.insertOne({
      title,
      category,
      content,
    });

    const insertedPost = await module.collections.posts.findOne({
      _id: result.insertedId,
    });

    res.status(201).json(insertedPost);
  });

  router.get("/post", async (req, res) => {
    const posts = await globals.exports.if.blog.retrievePosts();

    res.send(posts);
  });

  router.delete("/post/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await module.collections.posts.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(204).end();
  });

  const retrievePosts = async () => {
    return module.collections.posts.find({}).toArray();
  };

  return {
    router,
    exports: {
      retrievePosts,
    },
  };
};
