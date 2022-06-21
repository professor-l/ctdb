import { GraphQLContext } from "../context";

const getPlayerById = async (
  parent: unknown,
  args: { id: string, },
  context: GraphQLContext
) => {

  return context.prisma.player.findUnique({
    where: {
      id: args.id,
    }
  });

};

export default getPlayerById;