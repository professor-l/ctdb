import { Game } from "@prisma/client";
import { GraphQLContext } from "../context";

const game = {

  results: async (
    parent: Game,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.game.findUnique({
      where: { id: parent.id },
    }).results();
  },

  match: async (
    parent: Game,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.match.findUnique({
      where: { id: parent.matchId },
    });
  },

};

export default game;
