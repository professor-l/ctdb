import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
}

export async function contextFactory(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}