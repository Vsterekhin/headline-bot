import express from "express";
import pinoHttp from "pino-http";
const pino = pinoHttp as any;
import { createBot } from "./bot/index.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";

async function bootstrap() {
  const bot = createBot();
  const app = express();

  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  if (config.BOT_MODE === "webhook") {
    if (!config.TELEGRAM_WEBHOOK_URL) {
      throw new Error("TELEGRAM_WEBHOOK_URL is required in webhook mode");
    }

    const webhookPath = "/webhook/telegram";
    app.use(bot.webhookCallback(webhookPath));

    await bot.telegram.setWebhook(config.TELEGRAM_WEBHOOK_URL, {
      secret_token: config.TELEGRAM_SECRET_TOKEN
    });

    app.listen(config.PORT, () => {
      logger.info({ port: config.PORT }, "Webhook server started");
    });
  } else {
    await bot.launch();
    app.listen(config.PORT, () => {
      logger.info({ port: config.PORT }, "Polling bot started");
    });
  }

  process.once("SIGINT", async () => {
    bot.stop("SIGINT");
  });

  process.once("SIGTERM", async () => {
    bot.stop("SIGTERM");
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to bootstrap application");
  process.exit(1);
});
