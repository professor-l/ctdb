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
    data: args.payload,
  });

  return r;

};

export default createResultByPlayerId;