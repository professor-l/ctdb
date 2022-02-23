import { GraphQLContext } from "../context";

const getAllPlayers = async (
  parent: unknown,
  args: { },
  context: GraphQLContext
) => {
  return context.prisma.player.findMany();
};

export default getAllPlayers;