import { EloVersion, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  eloVersion: EloVersion;
}

export async function contextFactory(): Promise<GraphQLContext> {
  
  // current Elo version
  // TODO: this shouldn't be inline; hard-coding it is MVP-only
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
    eloVersion: currentEloVersion,
  };
}