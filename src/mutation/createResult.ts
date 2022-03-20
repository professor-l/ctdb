import { Prisma } from "@prisma/client";

import { GraphQLContext } from "../context";
import { ResultCreator } from "../types";
import { prepare } from "./prepareCreator";

const createResult = async (
  parent: unknown,
  args: {
    gameId: number,
    result: ResultCreator,
  },
  context: GraphQLContext
) => {

  let d = prepare.prepareResult(args.result);
  d.game = { connect: { id: args.gameId } };

  return await context.prisma.result.create({

    // cast prepared data as Prisma provided type
    data: d as Prisma.ResultCreateInput,
  });

};

export default createResult;