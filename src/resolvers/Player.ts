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
    return context.prisma.player.findUnique({
      where: { id: parent.id },
    }).results();
  },

};

export default player;