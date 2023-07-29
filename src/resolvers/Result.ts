import { Result } from "@prisma/client";
import { GraphQLContext } from "../context";

const result = {

  player: async (
    parent: Result,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.player.findUnique({
      where: { id: parent.playerId },
    });
  },

  game: async (
    parent: Result,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.game.findUnique({
      where: { id: parent.gameId },
    });
  },

};

export default result;
