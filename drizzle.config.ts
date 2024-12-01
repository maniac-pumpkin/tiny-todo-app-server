import { defineConfig } from "drizzle-kit";
import env from "./api/env";

export default defineConfig({
  out: "./api/db/migration",
  schema: "./api/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
});
