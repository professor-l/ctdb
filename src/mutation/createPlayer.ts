import { GraphQLContext, Playstyle } from "../context";

const createPlayer = async (
  parent: unknown,
  args: { 
    name: string,
    country?: string,
    playstyles?: Playstyle[],
  },
  context: GraphQLContext,
) => {

  return await context.prisma.player.create({
    data: {
      name: args.name,
      country: args.country,
      playstyles: args.playstyles,
    }
  });

};

export default createPlayer;