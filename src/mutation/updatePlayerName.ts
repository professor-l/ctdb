import { GraphQLContext } from "../context";

const updatePlayerName = async (
  parent: unknown,
  args: {
    payload: {
      oldEloName: string,
      newEloName: string,
    },
  },
  context: GraphQLContext
) => {

  const p = await context.prisma.player.update({
    where: { eloName: args.payload.oldEloName },
    data: { eloName: args.payload.newEloName },
  });

  return p;

};

export default updatePlayerName;