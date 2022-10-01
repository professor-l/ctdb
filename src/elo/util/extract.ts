import { GraphQLContext } from "../../context";
import { 
  ComputedElo,
  Match
} from "../util/types";
import { pullComputedElos } from "./dbInterface";

export const getComputedEloFromMatches = async (
  matches: Match[],
  context: GraphQLContext
): Promise<Map<string, ComputedElo>> => {
  const playerIds: string[] = [];

  matches.forEach(wrapper => {
    wrapper.prismaObject.games[0].results.forEach(r => {
      playerIds.push(r.playerId);
    });
  });

  const elos = await pullComputedElos(playerIds, context);

  const f: Map<string, ComputedElo> = new Map();
  elos.forEach(e => {
    f.set(e.playerId, e);
  });

  return f;
};
