import { GraphQLContext } from "../context";

const getEvent = async (
  parent: unknown,
  args: { name?: string, id?: number, },
  context: GraphQLContext
) => {

  return context.prisma.event.findUnique({
    where: {
      name: args.name,
      id: args.name ? undefined : args.id,
    }
  });
};

export default getEvent;