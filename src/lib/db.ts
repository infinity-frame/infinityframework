import { MongoClient } from "mongodb";
import logger from "./logger.js";

/** Always defined by App constructor */
const uri = process.env.IF_DBURI as string;
const client = new MongoClient(uri);

logger.info(`Initializing connection to db ${uri}`);
await client.connect();
await client.db("admin").command({ ping: 1 });
logger.info(`Connection to db ${uri} successfully initialized`);
