import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import env from "../env";
import * as schema from "./schema";

const sqlite = new Database(env.COLLECTION_PATH);
const db = drizzle(sqlite, { schema });
export default db;

export * from "drizzle-orm";
