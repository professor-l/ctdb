import { GraphQLContext } from "../context";

// TODO: make findUnique?
const getEventByName = async (
  parent: unknown,
  args: { name: string },
  context: GraphQLContext
) => {

  return context.prisma.event.findUnique({
    where: {
      name: args.name
    }
  });
};

export default getEventByName;
