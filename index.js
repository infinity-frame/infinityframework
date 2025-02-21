import "dotenv/config";
import ifcore from "./src/dist/index.js";

const app = await ifcore();

app.events.addListener("init", () => {});
