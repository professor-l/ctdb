import { EloSnapshot } from "@prisma/client";
import { GraphQLContext } from "../context";

const elos = {

  player: async (
    parent: EloSnapshot,
    context: GraphQLContext
  ) => {
    return context.prisma.player.findUnique({
      where: { id: parent.playerId },
    });
  },

  match: async (
    parent: EloSnapshot,
    context: GraphQLContext
  ) => {
    return context.prisma.match.findUnique({
      where: { id: parent.matchId },
    });
  },

};

export default elos;