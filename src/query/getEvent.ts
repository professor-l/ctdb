import { GraphQLContext } from "../context";

const getEvent = async (
  parent: unknown,
  args: { id: string, },
  context: GraphQLContext
) => {

  return context.prisma.event.findUnique({
    where: {
      id: args.id,
    }
  });
};

export default getEvent;
