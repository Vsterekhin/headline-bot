import type { Telegraf } from "telegraf";
import type { BotContext } from "../context.js";
import { clearSessionByTelegramId } from "../../services/session.service.js";
import { handleUsingLastSession } from "../helpers.js";

export function registerCommandHandlers(bot: Telegraf<BotContext>) {
  bot.start(async (ctx) => {
    await ctx.reply([
      "Пришлите текст пресс-релиза, и я подготовлю:",
      "— 10 заголовков",
      "— при необходимости медиапакет",
      "",
      "Команды: /help"
    ].join("\n"));
  });

  bot.command("help", async (ctx) => {
    await ctx.reply([
      "/start — запуск",
      "/help — помощь",
      "/reset — сбросить последний текст",
      "/more — ещё 10",
      "/official — официальнее",
      "/loud — громче",
      "/social — под соцсети",
      "/short — короче",
      "/mediapack — собрать медиапакет"
    ].join("\n"));
  });

  bot.command("reset", async (ctx) => {
    await clearSessionByTelegramId(ctx.from.id);
    await ctx.reply("Последний текст сброшен.");
  });

  bot.command("more", async (ctx) => handleUsingLastSession(ctx));
  bot.command("official", async (ctx) => handleUsingLastSession(ctx, "official"));
  bot.command("loud", async (ctx) => handleUsingLastSession(ctx, "loud"));
  bot.command("social", async (ctx) => handleUsingLastSession(ctx, "social"));
  bot.command("short", async (ctx) => handleUsingLastSession(ctx, "short"));
  bot.command("mediapack", async (ctx) => handleUsingLastSession(ctx, "mediapack"));
}
