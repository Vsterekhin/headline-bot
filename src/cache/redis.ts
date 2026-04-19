import { createClient } from "redis";
import { config } from "../config.js";
import { logger } from "../utils/logger.js";

export const redis = createClient({
  url: config.REDIS_URL
});

redis.on("error", (error) => {
  logger.error({ error }, "Redis error");
});
