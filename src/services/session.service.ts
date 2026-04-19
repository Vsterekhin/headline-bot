import { prisma } from "../db/prisma.js";
import type { Mode } from "../types/index.js";

export async function getSessionByTelegramId(telegramId: number) {
  return prisma.session.findFirst({
    where: {
      user: {
        telegramId: BigInt(telegramId)
      }
    },
    include: { user: true }
  });
}

export async function saveSession(userId: number, lastText: string, lastMode: Mode) {
  return prisma.session.upsert({
    where: { userId },
    update: { lastText, lastMode },
    create: { userId, lastText, lastMode }
  });
}

export async function clearSessionByTelegramId(telegramId: number) {
  const session = await getSessionByTelegramId(telegramId);
  if (!session) return;

  await prisma.session.delete({ where: { userId: session.userId } });
}
