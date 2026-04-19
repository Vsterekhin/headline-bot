import type { Telegraf } from "telegraf";
import type { BotContext } from "../context.js";
import { clearSessionByTelegramId } from "../../services/session.service.js";
import { handleUsingLastSession } from "../helpers.js";

export function registerActionHandlers(bot: Telegraf<BotContext>) {
  bot.action("more", async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsingLastSession(ctx);
  });

  bot.action("official", async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsingLastSession(ctx, "official");
  });

  bot.action("loud", async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsingLastSession(ctx, "loud");
  });

  bot.action("social", async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsingLastSession(ctx, "social");
  });

  bot.action("short", async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsingLastSession(ctx, "short");
  });

  bot.action("mediapack", async (ctx) => {
    await ctx.answerCbQuery();
    await handleUsingLastSession(ctx, "mediapack");
  });

  bot.action("reset", async (ctx) => {
    await ctx.answerCbQuery();
    await clearSessionByTelegramId(ctx.from.id);
    await ctx.reply("Последний текст сброшен.");
  });
}
