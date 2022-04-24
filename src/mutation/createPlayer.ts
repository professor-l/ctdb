import { GraphQLContext } from "../context";
import { Playstyle } from "../types";

const createPlayer = async (
  parent: unknown,
  args: { 
    eloName: string,
    name: string,
    country?: string,
    playstyles?: Playstyle[],
  },
  context: GraphQLContext,
) => {

  return await context.prisma.player.create({
    data: {
      eloName: args.eloName,
      name: args.name,
      country: args.country,
      playstyles: args.playstyles,
    }
  });

};

export default createPlayer;