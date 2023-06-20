import { GraphQLContext } from "../context";
import { Playstyle } from "../types";

const createResultByPlayerId = async (
  parent: unknown,
  args: {
    payload: {
      gameId: string,
      playerId: string,
      rank: number,
      playstyles?: Playstyle[],
      score?: number,
    },
  },
  context: GraphQLContext
) => {

  const r = await context.prisma.result.create({
    data: {
      player: {
        connect: { id: args.payload.playerId },
      },
      game: {
        connect: { id: args.payload.gameId },
      },
      rank: args.payload.rank,
      playstyles: args.payload.playstyles,
      score: args.payload.score,
    },
  });

  return r;

};

export default createResultByPlayerId;
