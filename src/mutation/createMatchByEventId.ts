import { MatchType, RomVersion } from "../types";
import { GraphQLContext } from "../context";

const createMatchByEventId = async (
  parent: unknown,
  args: {
    payload: {
      eventId: string,
      timestamp: Date,
      video?: string,
      type?: MatchType,
      rom: RomVersion,
    },
  },
  context: GraphQLContext
) => {

  const m = await context.prisma.match.create({
    data: args.payload
  });

  return m;
};

export default createMatchByEventId;