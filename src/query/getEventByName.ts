import { GraphQLContext } from "../context";

// TODO: make findUnique?
const getEventByName = async (
  parent: unknown,
  args: { name: string },
  context: GraphQLContext
) => {

  return context.prisma.event.findMany({
    where: {
      name: args.name
    }
  });
};

export default getEventByName;
