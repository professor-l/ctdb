import { GraphQLContext } from "../context";

const createGame = async (
  parent: unknown,
  args: {
    payload: {
      matchId: string,
      timestamp?: Date,
    },
  },
  context: GraphQLContext
) => {

  const g = await context.prisma.game.create({
    data: args.payload,
  });

  return g;

};

export default createGame;