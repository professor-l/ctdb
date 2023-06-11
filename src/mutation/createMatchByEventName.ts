import { MatchType, RomVersion } from "../types";
import { GraphQLContext } from "../context";

const createMatchByEventName = async (
  parent: unknown,
  args: {
    payload: {
      eventName: string,
      timestamp: Date,
      video?: string,
      type?: MatchType,
      rom?: RomVersion,
    },
  },
  context: GraphQLContext
) => {

  const m = await context.prisma.match.create({
    data: {
      event: {
        connect: { name: args.payload.eventName },
      },
      timestamp: args.payload.timestamp,
      video: args.payload.video,
      type: args.payload.type,
      rom: args.payload.rom,
    }
  });

  return m;
};

export default createMatchByEventName;
