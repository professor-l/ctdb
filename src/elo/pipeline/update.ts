import { ComputedElo } from "@prisma/client";
import { ComputedElo as ComputedEloIM } from "../util/types";

export const updateComputedElo = (
  old: ComputedElo,
  updated: ComputedEloIM | undefined
) => {
  if (updated !== undefined) {
    old.elo = updated.elo;
    old.winCount = updated.winCount;
    old.lossCount = updated.lossCount;
    old.highestElo = updated.highestElo;
    old.lastMatch = updated.lastMatch;
  }
};
