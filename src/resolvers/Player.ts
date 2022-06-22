import { Player } from "@prisma/client";
import { GraphQLContext } from "../context";

const player = {

  eloHistory: async (
    parent: Player,
    context: GraphQLContext
  ) => {
    return context.prisma.eloSnapshot.findMany({
      where: {
        playerId: parent.id,
        versionId: context.eloVersionId,
      },
    });
  },

  results: async (
    parent: Player,
    context: GraphQLContext
  ) => {
    return context.prisma.result.findMany({
      where: { playerId: parent.id },
    });
  },

};

export default player;