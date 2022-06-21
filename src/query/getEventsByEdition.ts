import { GraphQLContext } from "../context";

const getEventsByEdition = async (
  parent: unknown,
  args: { edition: string, },
  context: GraphQLContext
) => {

  return context.prisma.event.findMany({
    where: {
      edition: args.edition,
    }
  });
};

export default getEventsByEdition;