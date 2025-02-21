import { Collection, Db, MongoClient } from "mongodb";
import logger from "./logger.js";

export interface Database {
  db: Db;
  closeClient: () => Promise<void>;
}

export async function DbFactory(uri: string): Promise<Database> {
  logger.info(`Initializing connection to db ${uri}`);
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("admin");
  await db.command({ ping: 1 });
  logger.info(`Connection to db ${uri} successfully initialized`);

  const closeClient = async () => await client.close();
  return { db, closeClient };
}
