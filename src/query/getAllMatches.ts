import { GraphQLContext } from "../context";

const getAllMatches = async (
  parent: unknown,
  _args: { }, // eslint-disable-line
  context: GraphQLContext
) => {
  return context.prisma.match.findMany({
    include: {
      games: {
        include: {
          results: {
            include: {
              player: true,
            }
          },
        }
      },
      event: true,
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 1000,
  });
};

export default getAllMatches;
