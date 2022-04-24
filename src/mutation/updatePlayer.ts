import { Playstyle, Pronoun } from "@prisma/client";
import { GraphQLContext } from "../context";

const updatePlayer = async (
  parent: unknown,
  args: {
    playerName: string,
    newName?: string,
    newCountry?: string,
    newPronouns?: Pronoun[],
    newPlaystyles?: Playstyle[]
  },
  context: GraphQLContext
) => {

  return await context.prisma.player.update({
    where: {
      eloName: args.playerName,
    },
    data: {
      name: args.newName,
      country: args.newCountry,

      // full overwrite of scalar
      // TODO: additions w/o overwrite?
      playstyles: args.newPlaystyles,
      pronouns: args.newPronouns,
    },
  });
};

export default updatePlayer;