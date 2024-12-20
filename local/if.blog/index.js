export default (globals, module) => {
  console.log(globals.event);

  globals.event.addListener("init", () => {
    console.log("Initialzed caught from the module!");
  });
};
