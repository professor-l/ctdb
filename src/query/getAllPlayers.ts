import { GraphQLContext } from "../context";

const getAllPlayers = async (
  parent: unknown,
  _args: { }, // eslint-disable-line
  context: GraphQLContext
) => {
  return context.prisma.player.findMany();
};

export default getAllPlayers;