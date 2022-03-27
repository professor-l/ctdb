import { Prisma } from "@prisma/client";

import { GraphQLContext } from "../context";
import { GameCreator } from "../types";
import { prepare } from "./prepareCreator";

const createGame = async (
  parent: unknown,
  args: {
    matchId: string,
    game: GameCreator,
  },
  context: GraphQLContext
) => {

  const d = prepare.prepareGame(args.game);
  d.match = { connect: { id: args.matchId } };

  return await context.prisma.game.create({

    // cast prepared data as Prisma provided type
    data: d as Prisma.GameCreateInput,
  });

};

export default createGame;