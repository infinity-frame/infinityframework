import { MongoClient } from "mongodb";
import logger from "./logger.js";

/** Temporary, will be replaced with a environment.json file */
if (typeof process.env.IF_DBURI !== "string") {
  throw new Error(
    "Database initialization error - environment variable IF_DBURI is undefined"
  );
}

const uri = process.env.IF_DBURI;
logger.info(`Initializing connection to db ${uri}`);
const client = new MongoClient(uri);
await client.connect();
await client.db("admin").command({ ping: 1 });
logger.info(`Connection to db ${uri} successfully initialized`);

export const db = client.db("if");
