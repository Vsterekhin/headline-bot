import type { UserContext } from "../types/index.js";

export async function upsertUser(context: UserContext) {
  return {
    id: context.telegramId,
    telegramId: BigInt(context.telegramId),
    username: context.username,
    firstName: context.firstName,
    lastName: context.lastName
  };
}
