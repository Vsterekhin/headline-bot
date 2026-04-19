import type { Telegraf } from "telegraf";
import type { BotContext } from "../context.js";
import { handleGeneration } from "../helpers.js";

export function registerTextHandler(bot: Telegraf<BotContext>) {
  bot.on("text", async (ctx) => {
    const text = ctx.message.text;
    await handleGeneration(ctx, text, "default");
  });
}
