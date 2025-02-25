import { Db, MongoClient } from "mongodb";
import { Logger } from "pino";
import { Manifest } from "./Manifest.js";

export interface Database {
	db: Db;
	closeClient: () => Promise<void>;
}

export async function DbFactory(
	manifest: Manifest,
	logger: Logger
): Promise<Database> {
	const uri: string = manifest.dbUri;

	logger.info(`Initializing connection to db ${uri}`);
	const client = new MongoClient(uri);
	await client.connect();

	const adminDb = client.db("admin");
	await adminDb.command({ ping: 1 });
	logger.info(`Connection to db ${uri} successfully initialized`);

	const db = client.db("if");

	const closeClient = async () => await client.close();
	return { db, closeClient };
}
