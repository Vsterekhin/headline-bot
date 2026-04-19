import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  BOT_TOKEN: z.string().min(1),
  TELEGRAM_WEBHOOK_URL: z.string().url().optional(),
  TELEGRAM_SECRET_TOKEN: z.string().optional(),
  BOT_MODE: z.enum(["polling", "webhook"]).default("polling"),
  ALLOWED_USER_IDS: z.string().default(""),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
  LLM_TIMEOUT_MS: z.coerce.number().default(20000),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().default(20),
  LOG_LEVEL: z.string().default("info")
});

const env = envSchema.parse(process.env);

export const config = {
  ...env,
  allowedUserIds: env.ALLOWED_USER_IDS
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => Number(id))
};
