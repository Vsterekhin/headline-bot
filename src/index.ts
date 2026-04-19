import express from "express";
import { createBot } from "./bot/index.js";
import { config } from "./config.js";

async function bootstrap() {
  const bot = createBot();
  const app = express();

  app.use(express.json());

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
      console.log(`Webhook server started on ${config.PORT}`);
    });
  } else {
    await bot.launch();
    app.listen(config.PORT, () => {
      console.log(`Polling bot started on ${config.PORT}`);
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
  console.error("Failed to bootstrap application", error);
  process.exit(1);
});
