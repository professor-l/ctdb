import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// mapping of enums for typescript
export enum Pronoun {
  HE = "HE",
  SHE = "SHE",
  THEY = "THEY"
}

export enum Playstyle {
  DAS = "DAS",
  TAP = "TAP",
  ROLL = "ROLL"
}

export enum RomVersion {
  NTSC = "NTSC",
  PAL = "PAL",
  NTSC_CUSTOM = "NTSC_CUSTOM",
  PAL_CUSTOM = "PAL_CUSTOM"
}

export type GraphQLContext = {
  prisma: PrismaClient;
}

export async function contextFactory(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}