import { GraphQLContext } from "../context";
import { Playstyle } from "../types";

const createResultByPlayerName = async (
  parent: unknown,
  args: {
    payload: {
      gameId: string,
      playerName: string,
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
        connect: { eloName: args.payload.playerName },
      },
      game: {
        connect: { id: args.payload.gameId },
      },
      rank: args.payload.rank,
      styles: args.payload.playstyles,
      score: args.payload.score,
    },
  });

  return r;

};

export default createResultByPlayerName;