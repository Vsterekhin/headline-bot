import { Telegraf } from "telegraf";
import { config } from "../config.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware.js";
import { registerActionHandlers } from "./handlers/action.handler.js";
import { registerCommandHandlers } from "./handlers/command.handler.js";
import { registerTextHandler } from "./handlers/text.handler.js";
import type { BotContext } from "./context.js";

export function createBot() {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN);

  bot.use(authMiddleware);
  bot.use(rateLimitMiddleware);

  registerCommandHandlers(bot);
  registerActionHandlers(bot);
  registerTextHandler(bot);

  return bot;
}
