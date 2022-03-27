import { Prisma } from "@prisma/client";

import { GraphQLContext } from "../context";
import { EventCreator } from "../types";
import { prepare } from "./prepareCreator";

const createEvent = async (
  parent: unknown,
  args: {
    organizationName?: string,
    event: EventCreator,
  },
  context: GraphQLContext
) => {

  const d = prepare.prepareEvent(args.event);

  if (args.organizationName)
    d.organizer = { connect: { name: args.organizationName } };

  return await context.prisma.event.create({

    // cast prepared data as Prisma provided type
    data: d as Prisma.EventCreateInput,
  });
};

export default createEvent;