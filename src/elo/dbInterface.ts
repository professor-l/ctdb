import { 
  ComputedElo as ComputedEloIM,
  Match as MatchIM,
  MatchWrapper
} from "./util/types";

import { GraphQLContext } from "../context";
import { Game, Match, Result } from "@prisma/client";


export const pullComputedElo = async (
  playerId: string,
  context: GraphQLContext
): Promise<ComputedEloIM | null> => {

  const e = await context.prisma.computedElo.findUnique({
    where: {
      playerId_versionId: {
        playerId,
        versionId: context.eloVersionId,
      },
    },
  });

  return e === null ? null : <ComputedEloIM>e;
};

export const pullManyComputedElo = async (
  playerIds: string[],
  context: GraphQLContext
): Promise<ComputedEloIM[] | null> => {

  const e = await context.prisma.computedElo.findMany({
    where: {
      playerId: {
        in: playerIds,
      },
      versionId: context.eloVersionId,
    },
  });

  if (e === null) return null;

  return e.map(c => <ComputedEloIM>c);

};

// Abstract non-db calculation out of this so pullMatchMany
// can utilize the same logic
export const pullMatch = async (
  matchId: string,
  context: GraphQLContext
): Promise<MatchWrapper | null> => {

  const m = await context.prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      games: {
        include: {
          results: true,
        }
      }
    }
  });
  
  if (m === null) return null;
  
  return matchConverter(m);
};

export const pullManyMatch = async (
  matchIds: string[],
  context: GraphQLContext
): Promise<MatchWrapper[] | null> => {

  const m = await context.prisma.match.findMany({
    where: {
      id: {
        in: matchIds,
      },
    },
    include: {
      games: {
        include: {
          results: true,
        }
      }
    }
  });

  return m.map(match => matchConverter(match));
};

const matchConverter = (
  m: Match & {games: (Game & {results: Result[]})[]}
): MatchWrapper => {
  const submatches: Record<string, MatchIM> = {};
  let g;

  // for each game
  for (let i = 0; i < m.games.length; ++i) {
    g = m.games[i];
    
    // for each result
    for (let j = 0; j < g.results.length; ++j) {

      // for each pair of results
      for (let k = j + 1; k < g.results.length; ++k) {

        // standardize order for parses of subsequent games
        const r = [g.results[j], g.results[k]];
        const key = [r[0].playerId, r[1].playerId].sort().join(".");

        // initialize if necessary
        if (submatches[key] === undefined) {
          submatches[key] = {
            winners: [],
            scores: [],
            player0Id: r[0].playerId,
            player1Id: r[1].playerId,
          };
        }

        // cleverly index winner and loser
        // (since typescript doesn't allow `!n` on a number)
        const winner = r[0].rank > r[1].rank ? 0 : 1;
        const loserScore = r[(winner * -1) + 1].score;

        submatches[key].winners.push(winner);

        if (loserScore !== null)
          submatches[key].scores.push(loserScore);
      }
    }
  }

  const wrapper: MatchWrapper = {
    matchId: m.id,
    type: m.type,
    rom: m.rom,
    timestamp: m.timestamp,
    prismaObject: m,
    submatches: Object.entries(submatches).map(([, value]) => value),
  };

  return wrapper;
};