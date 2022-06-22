import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  eloVersionId?: string;
}

export async function contextFactory(): Promise<GraphQLContext> {
  
  // current Elo version
  // TODO: hard-coding this is an MVP solution
  const versionString = "1.0";

  // get (or create) current elo version in db
  const currentEloVersion = await prisma.eloVersion.upsert({
    where: { version: versionString },
    update: { },
    create: {
      version: versionString,
    },
  });
  
  return {
    prisma,
    eloVersionId: currentEloVersion.id,
  };
}