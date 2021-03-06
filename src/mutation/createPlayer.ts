import { GraphQLContext } from "../context";
import { Playstyle } from "../types";

const createPlayer = async (
  parent: unknown,
  args: {
    payload: {
      eloName: string,
      playstyles?: Playstyle[],
    },
  },
  context: GraphQLContext,
) => {

  const p = await context.prisma.player.create({
    data: args.payload,
  });

  return p;
};

export default createPlayer;