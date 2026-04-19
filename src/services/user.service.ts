import { prisma } from "../db/prisma.js";
import type { UserContext } from "../types/index.js";

export async function upsertUser(context: UserContext) {
  return prisma.user.upsert({
    where: { telegramId: BigInt(context.telegramId) },
    update: {
      username: context.username,
      firstName: context.firstName,
      lastName: context.lastName
    },
    create: {
      telegramId: BigInt(context.telegramId),
      username: context.username,
      firstName: context.firstName,
      lastName: context.lastName
    }
  });
}
