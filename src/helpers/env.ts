import { z } from "zod";

const envSchema = z.object({
  SERVER_PORT: z.string(),
  SERVER_URL: z.string(),
  JWT_SECRET_TOKEN: z.string(),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASSWORD: z.string(),
  POSTGRES_URL: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
