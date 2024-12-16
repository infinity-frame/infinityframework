import { MongoClient } from "mongodb";
import logger from "./logger.js";

/** Always defined by App constructor */
const uri = process.env.IF_DBURI as string;
logger.info(`Initializing connection to db ${uri}`);
const client = new MongoClient(uri);
await client.connect();
await client.db("admin").command({ ping: 1 });
logger.info(`Connection to db ${uri} successfully initialized`);

export const db = client.db("if");
