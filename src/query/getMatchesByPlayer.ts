import { GraphQLContext } from "../context";

const getMatchesByPlayer = async (
  parent: unknown,
  args: { eloName?: string }, // eslint-disable-line
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
    where: {
      games: {
        some: {
          results: {
            some: {
              player: {
                eloName: {
                  contains: args.eloName,
                  mode: "insensitive",
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
};

export default getMatchesByPlayer;
