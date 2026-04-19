import { Markup } from "telegraf";
import type { HeadlineResponse, MediaPackResponse } from "../types/index.js";

export function buildKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🔁 Ещё 10", "more"),
      Markup.button.callback("🧊 Официальнее", "official")
    ],
    [
      Markup.button.callback("🔥 Громче", "loud"),
      Markup.button.callback("💬 Соцсети", "social")
    ],
    [
      Markup.button.callback("✂️ Короче", "short"),
      Markup.button.callback("📦 Медиапакет", "mediapack")
    ],
    [Markup.button.callback("🗑 Сброс", "reset")]
  ]);
}

export function formatHeadlines(data: HeadlineResponse): string {
  return [
    "ОФИЦИАЛЬНЫЕ:",
    ...data.official.map((item, index) => `${index + 1}. ${item}`),
    "",
    "ГРОМКИЕ:",
    ...data.loud.map((item, index) => `${index + 5}. ${item}`),
    "",
    "ДЛЯ СОЦСЕТЕЙ:",
    ...data.social.map((item, index) => `${index + 8}. ${item}`)
  ].join("\n");
}

export function formatMediaPack(data: MediaPackResponse): string {
  return [
    formatHeadlines(data),
    "",
    "ЛИД:",
    data.lead,
    "",
    "ПОСТ TELEGRAM:",
    data.telegram_post,
    "",
    "КОРОТКАЯ НОВОСТЬ:",
    data.short_news,
    "",
    "АНОНС:",
    data.announcement
  ].join("\n");
}
