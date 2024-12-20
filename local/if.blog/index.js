export default (globals, module) => {
  module.collections.posts.insertOne({
    text: "I have inserted a document!",
  });
};
