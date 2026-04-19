import type { Mode } from "../types/index.js";

type Session = {
  userId: number;
  lastText: string;
  lastMode: Mode;
  user?: {
    telegramId: bigint;
  };
};

const sessions = new Map<number, Session>();

export async function getSessionByTelegramId(telegramId: number) {
  return sessions.get(telegramId) ?? null;
}

export async function saveSession(userId: number, lastText: string, lastMode: Mode) {
  const session: Session = {
    userId,
    lastText,
    lastMode,
    user: {
      telegramId: BigInt(userId)
    }
  };

  sessions.set(userId, session);
  return session;
}

export async function clearSessionByTelegramId(telegramId: number) {
  sessions.delete(telegramId);
}
