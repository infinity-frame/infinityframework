import express from "express";
const moduleInitializer = async (context) => {
    const router = express.Router();
    context.app.events.addListener("initialized", () => {
        context.logger.info(context.app.modules);
    });
    return {
        router,
        methods: {
            stuff() { },
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
//   router.post("/post", async (req, res) => {
//     console.log(req.body);
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
//     res.send(result);
//   });
//   router.get("/post", async (req, res) => {
//     const posts = await globals.exports.if.blog.retrievePosts();
//     res.send(posts);
//   });
//   router.get("/post/:id", async (req, res) => {
//     const post = await module.collections.posts.findOne({
//       _id: module.mongo.ObjectId(req.params.id),
//     });
//     if (!post) {
//       res.status(404).json({ error: "Post not found" });
//       return;
//     }
//     res.send(post);
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
