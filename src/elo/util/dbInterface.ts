import { 
  ComputedElo as ComputedEloIM,
  EloSnapshot as EloSnapshotIM,
  Submatch as SubmatchIM,
  Match as MatchIM
} from "../util/types";

import { GraphQLContext } from "../../context";
import { Game, Match, Result, ComputedElo } from "@prisma/client";


export const pullComputedElos = async (
  playerIds: string[],
  context: GraphQLContext
): Promise<ComputedEloIM[]> => {

  const e = await context.prisma.computedElo.findMany({
    where: {
      playerId: {
        in: playerIds,
      },
      versionId: context.eloVersion.id,
    },
  });

  const elos: ComputedEloIM[] = [];
  const newPlayers: string[] = [];
  
  // populate absent computedElos with null
  playerIds.forEach(id => {
    let found = false;

    for (let i = 0; i < e.length; ++i) {
      if (e[i].playerId == id) {
        elos.push(<ComputedEloIM>(e[i]));
        found = true;
        break;
      }
    }

    if (!found && newPlayers.indexOf(id) === -1)
      newPlayers.push(id);

  });

  (await createNewComputedElos(newPlayers, context)).forEach(n => {
    elos.push(n);
  });

  return elos;

};

export const pullMatches = async (
  oldestMatchId: string,
  context: GraphQLContext
): Promise<MatchIM[]> => {

  const oldestMatch = await context.prisma.match.findUnique({
    where: {
      id: oldestMatchId
    }
  });

  if (!oldestMatch)
    return [];

  // get all matches newer than oldestMatch and older than newestMatch (if
  // provided)
  const m = await context.prisma.match.findMany({
    where: {
      timestamp: {
        gte: oldestMatch.timestamp,
      }
    },
    include: {
      games: {
        include: {
          results: true,
        }
      }
    },
    orderBy: {
      timestamp: "asc",
    }
  });

  return m.map(match => matchConverter(match));
};

// pulls all computed Elo values in range, of min,max (inclusive)
export const pullComputedElosInRange = async (
  min: number,
  max: number,
  context: GraphQLContext
): Promise<ComputedElo[]> => {
  
  const e = await context.prisma.computedElo.findMany({
    where: {
      AND: [
        { elo: { lte: max } },
        { elo: { gte: min } },
      ],
    },
  });

  return e;
};

const createNewComputedElos = async (
  playerIds: string[],
  context: GraphQLContext
): Promise<ComputedEloIM[]> => {

  const toReturn: ComputedEloIM[] = [];

  const c = await context.prisma.computedElo.createMany({
    data: playerIds.map(p => { 
      const toAdd = {
        playerId: p,
        versionId: context.eloVersion.id,
        rank: 0,
        elo: context.eloVersion.startingValue,
        highestElo: context.eloVersion.startingValue,
        winCount: 0,
        lossCount: 0,
        lastMatch: new Date(0),
      };

      toReturn.push(<ComputedEloIM>toAdd);
      return toAdd;
    }),
  });

  return toReturn;

};

// NOTE: does not update lastMatch timestamp
export const updateComputedFromChange = (
  c: ComputedEloIM,
  change: number
) => {

  const win = (change > 0 ? 1 : 0);
  c.elo += change;

  if (c.elo > c.highestElo)
    c.highestElo = c.elo;

  c.winCount = c.winCount + win;
  c.lossCount = c.lossCount - (win - 1);
};

export const writeComputedElos = async (
  elos: ComputedElo[],
  context: GraphQLContext
) => {
  
  const updated = await context.prisma.$transaction(
    elos.map(e =>
      context.prisma.computedElo.update({
        where: { id: e.id },
        data: e,
      })
    )
  );
};

export const writeEloSnapshots = async (
  snapshots: EloSnapshotIM[],
  context: GraphQLContext
) => {
  const upserts = snapshots.map(snapshot =>
    context.prisma.eloSnapshot.upsert({
      where: {
        playerId_matchId_versionId: {
          playerId: snapshot.playerId,
          matchId: snapshot.matchId,
          versionId: snapshot.versionId,
        },
      },
      // do not update existing snapshot
      update: { },
      create: snapshot,
    })
  );

  return Promise.all(upserts);
};


const matchConverter = (
  m: Match & {games: (Game & {results: Result[]})[]}
): MatchIM => {
  const submatches: Record<string, SubmatchIM> = {};
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
        const winner = r[0].rank < r[1].rank ? 0 : 1;
        const loserScore = r[(winner * -1) + 1].score;

        submatches[key].winners.push(winner);

        if (loserScore !== null)
          submatches[key].scores.push(loserScore);
      }
    }
  }

  const match: MatchIM = {
    matchId: m.id,
    type: m.type,
    rom: m.rom,
    timestamp: m.timestamp,
    prismaObject: m,
    submatches: Object.entries(submatches).map(([, value]) => value),
  };

  return match;
};
