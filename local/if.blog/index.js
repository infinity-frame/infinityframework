import express from "express";

export default (globals, module) => {
  // module.collections.posts.insertOne({
  //   text: "I have inserted a document!",
  // });

  const router = express.Router();

  router.get("/ping", async (req, res) => {
    console.log(await globals.exports.if.blog.retrievePosts());

    res.send("The module is mounted!");
  });

  const retrievePosts = async () => {
    return module.collections.posts.find({});
  };

  return {
    router,
    exports: {
      retrievePosts,
    },
  };
};
