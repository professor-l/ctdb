import { GraphQLContext } from "../context";

const getPlayerByEloName = async (
  parent: unknown,
  args: { eloName: string, },
  context: GraphQLContext
) => {

  return context.prisma.player.findUnique({
    where: {
      eloName: args.eloName,
    }
  });

};

export default getPlayerByEloName;
