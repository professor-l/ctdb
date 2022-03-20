import { Prisma } from "@prisma/client";

import { GraphQLContext } from "../context";
import { MatchCreator } from "../types";
import { prepare } from "./prepareCreator";

const createMatch = async (
  parent: unknown,
  args: {
    eventId: number,
    match: MatchCreator,
  },
  context: GraphQLContext
) => {

  let d = prepare.prepareMatch(args.match);
  d.event = { connect: { id: args.eventId } };

  return await context.prisma.match.create({

    // cast prepared data as Prisma provided type
    data: d as Prisma.MatchCreateInput,
  })

};

export default createMatch;