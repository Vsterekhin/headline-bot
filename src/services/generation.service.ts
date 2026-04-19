import { generateContent } from "../llm/llm.client.js";
import type { MediaPackResponse, Mode } from "../types/index.js";

export async function generateAndStore(_userId: number, inputText: string, mode: Mode) {
  return generateContent(inputText, mode);
}

export function isMediaPack(result: unknown): result is MediaPackResponse {
  return typeof result === "object" && result !== null && "lead" in result;
}
