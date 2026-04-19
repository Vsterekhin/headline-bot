import { prisma } from "../db/prisma.js";
import { generateContent } from "../llm/llm.client.js";
import type { MediaPackResponse, Mode } from "../types/index.js";

export async function generateAndStore(userId: number, inputText: string, mode: Mode) {
  const result = await generateContent(inputText, mode);

  await prisma.generation.create({
    data: {
      userId,
      mode,
      inputText,
      result: JSON.parse(JSON.stringify(result))
    }
  });

  return result;
}

export function isMediaPack(result: unknown): result is MediaPackResponse {
  return typeof result === "object" && result !== null && "lead" in result;
}
