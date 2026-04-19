import OpenAI from "openai";
import { z } from "zod";
import { config } from "../config.js";
import { logger } from "../utils/logger.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts.js";
import type { HeadlineResponse, MediaPackResponse, Mode } from "../types/index.js";

const headlineSchema = z.object({
  official: z.array(z.string()).length(4),
  loud: z.array(z.string()).length(3),
  social: z.array(z.string()).length(3)
});

const mediaPackSchema = headlineSchema.extend({
  lead: z.string().min(1),
  telegram_post: z.string().min(1),
  short_news: z.string().min(1),
  announcement: z.string().min(1)
});

const client = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
  baseURL: config.OPENAI_BASE_URL,
  timeout: config.LLM_TIMEOUT_MS
});

function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function repairHeadlineResult(data: HeadlineResponse): HeadlineResponse {
  const official = dedupe(data.official).slice(0, 4);
  const loud = dedupe(data.loud).slice(0, 3);
  const social = dedupe(data.social).slice(0, 3);

  while (official.length < 4) official.push(official[official.length - 1] || "В Тульской области состоялось важное событие");
  while (loud.length < 3) loud.push(loud[loud.length - 1] || "В регионе произошло заметное событие");
  while (social.length < 3) social.push(social[social.length - 1] || "Событие, о котором будут говорить");

  return { official, loud, social };
}

export async function generateContent(text: string, mode: Mode): Promise<HeadlineResponse | MediaPackResponse> {
  const completion = await client.chat.completions.create({
    model: config.OPENAI_MODEL,
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(text, mode) }
    ]
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("LLM returned empty content");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    logger.error({ error, raw }, "Failed to parse LLM JSON");
    throw new Error("LLM returned invalid JSON");
  }

  if (mode === "mediapack") {
    const result = mediaPackSchema.parse(parsed);
    return {
      ...repairHeadlineResult(result),
      lead: result.lead.trim(),
      telegram_post: result.telegram_post.trim(),
      short_news: result.short_news.trim(),
      announcement: result.announcement.trim()
    };
  }

  return repairHeadlineResult(headlineSchema.parse(parsed));
}
