import { GraphQLContext } from "../context";

const getEventsByName = async (
  parent: unknown,
  args: { name?: string, edition?: string },
  context: GraphQLContext
) => {
  const operator = args.name && args.edition ? 'AND' : 'OR'

  return context.prisma.event.findMany({
    where: {
      [operator]: [
        {
          name: args.name,
        },
        {
          edition: args.edition,
        }
      ]
    }
  });

  // return context.prisma.event.findUnique({
  //   where: {
  //     id: 1,
  //   }
  // });
};

export default getEventsByName;
