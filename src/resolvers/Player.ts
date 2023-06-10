import { Player } from "@prisma/client";
import { GraphQLContext } from "../context";

const player = {

  eloHistory: async (
    parent: Player,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.eloSnapshot.findMany({
      where: {
        playerId: parent.id,
        versionId: context.eloVersion.id,
      },
    });
  },

  results: async (
    parent: Player,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.player.findUnique({
      where: { id: parent.id },
    }).results();
  },

};

export default player;
