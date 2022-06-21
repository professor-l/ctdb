import { GraphQLContext } from "../context";
import { Playstyle, Pronoun } from "../types";

const createPlayer = async (
  parent: unknown,
  args: {
    payload: {
      eloName: string,
      name?: string,
      playstyles?: Playstyle[],
      pronouns?: Pronoun[],
      counrty?: string,
    },
  },
  context: GraphQLContext,
) => {

  const p = await context.prisma.player.create({
    data: args.payload
  });

  return p;
};

export default createPlayer;