import type { Context, MiddlewareFn } from "telegraf";
import { config } from "../config.js";

export const authMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;

  if (!userId) {
    return;
  }

  if (config.allowedUserIds.length > 0 && !config.allowedUserIds.includes(userId)) {
    await ctx.reply("Нет доступа.");
    return;
  }

  await next();
};
