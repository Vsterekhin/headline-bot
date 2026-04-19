import { prisma } from "../db/prisma.js";

export async function writeLog(action: string, payload?: unknown, userId?: number) {
  await prisma.log.create({
    data: {
      userId,
      action,
      payload: payload ? JSON.parse(JSON.stringify(payload)) : undefined
    }
  });
}
