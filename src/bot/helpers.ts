import type { BotContext } from "./context.js";
import { buildKeyboard, formatHeadlines, formatMediaPack } from "../utils/formatter.js";
import { ensureUsefulText } from "../utils/validator.js";
import { generateAndStore, isMediaPack } from "../services/generation.service.js";
import { getSessionByTelegramId, saveSession } from "../services/session.service.js";
import { upsertUser } from "../services/user.service.js";
import { writeLog } from "../services/log.service.js";
import type { Mode } from "../types/index.js";

export async function registerTelegramUser(ctx: BotContext) {
  if (!ctx.from) return null;

  return upsertUser({
    telegramId: ctx.from.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name
  });
}

export async function handleGeneration(ctx: BotContext, text: string, mode: Mode) {
  const validation = ensureUsefulText(text);
  if (!validation.ok) {
    await ctx.reply(validation.message!);
    return;
  }

  const user = await registerTelegramUser(ctx);
  if (!user) return;

  await ctx.reply("Готовлю варианты...");

  const result = await generateAndStore(user.id, text, mode);
  await saveSession(user.id, text, mode);
  await writeLog("generate", { mode, textLength: text.length }, user.id);

  const payload = isMediaPack(result) ? formatMediaPack(result) : formatHeadlines(result);
  await ctx.reply(payload, {
    ...buildKeyboard()
  });
}

export async function handleUsingLastSession(ctx: BotContext, mode?: Mode) {
  if (!ctx.from) return;

  const session = await getSessionByTelegramId(ctx.from.id);
  if (!session) {
    await ctx.reply("Сначала отправьте текст пресс-релиза.");
    return;
  }

  await handleGeneration(ctx, session.lastText, mode ?? (session.lastMode as Mode));
}
