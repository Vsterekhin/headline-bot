import type { HeadlineResponse, MediaPackResponse, Mode } from "../types/index.js";

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function firstSentence(text: string) {
  const cleaned = cleanText(text);
  const parts = cleaned.split(/[.!?]/).map((p) => p.trim()).filter(Boolean);
  return parts[0] || cleaned.slice(0, 120) || "В Тульской области произошло важное событие";
}

function shortTopic(text: string) {
  const sentence = firstSentence(text);
  return sentence.length > 90 ? sentence.slice(0, 90).trim() + "..." : sentence;
}

function buildHeadlines(text: string): HeadlineResponse {
  const topic = shortTopic(text);

  return {
    official: [
      topic,
      `В Тульской области состоялось событие по теме: ${topic}`,
      `Дмитрий Миляев обсудил вопрос по теме: ${topic}`,
      `В регионе продолжена работа по направлению: ${topic}`
    ],
    loud: [
      `Миляев обсудил ключевые вопросы по теме: ${topic}`,
      `В Тульской области усиливают работу по теме: ${topic}`,
      `Тула делает следующий шаг в теме: ${topic}`
    ],
    social: [
      `Что важно знать: ${topic}`,
      `Тула в деле: ${topic}`,
      `Коротко о главном: ${topic}`
    ]
  };
}

export async function generateContent(text: string, mode: Mode): Promise<HeadlineResponse | MediaPackResponse> {
  const headlines = buildHeadlines(text);

  if (mode === "mediapack") {
    return {
      ...headlines,
      lead: `В Тульской области продолжается работа по теме: ${shortTopic(text)}.`,
      telegram_post: `Главное по теме: ${shortTopic(text)}.\n\nПодготовили варианты заголовков и краткую выжимку.`,
      short_news: `В регионе продолжается работа по теме: ${shortTopic(text)}.`,
      announcement: `В Тульской области продолжается работа по теме: ${shortTopic(text)}.`
    };
  }

  if (mode === "official") {
    return {
      official: headlines.official,
      loud: headlines.official.slice(0, 3),
      social: headlines.official.slice(0, 3)
    };
  }

  if (mode === "loud") {
    return {
      official: headlines.loud.concat(headlines.official[0]).slice(0, 4),
      loud: headlines.loud,
      social: headlines.loud
    };
  }

  if (mode === "social" || mode === "short") {
    return {
      official: headlines.social.concat(headlines.official[0]).slice(0, 4),
      loud: headlines.social,
      social: headlines.social
    };
  }

  return headlines;
}
