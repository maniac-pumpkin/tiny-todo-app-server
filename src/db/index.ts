import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import env from "../helpers/env";

const sql = neon(env.POSTGRES_URL);
const db = drizzle(sql);

export default db;
