import { Game } from "@prisma/client";
import { GraphQLContext } from "../context";

const game = {

  results: async (
    parent: Game,
    context: GraphQLContext
  ) => {
    return context.prisma.result.findMany({
      where: { gameId: parent.id },
    });
  },

  match: async (
    parent: Game,
    context: GraphQLContext
  ) => {
    return context.prisma.match.findUnique({
      where: { id: parent.matchId },
    });
  },

};

export default game;