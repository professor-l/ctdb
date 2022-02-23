import { GraphQLContext } from "../context";
import { Prisma } from "@prisma/client";

const createPlayer = async (
  parent: unknown,
  args: { name: string, country?: string },
  context: GraphQLContext,
) => {

  let newPlayer: Prisma.PlayerCreateInput = {
    name: args.name,
  };

  if (args.country)
    newPlayer.country = args.country;

  return await context.prisma.player.create({
    data: newPlayer,
  });

};

export default createPlayer;