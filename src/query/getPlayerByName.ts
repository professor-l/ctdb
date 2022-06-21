import { GraphQLContext } from "../context";

const getPlayerByName = async (
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

export default getPlayerByName;