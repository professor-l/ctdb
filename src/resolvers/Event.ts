import { Event } from "@prisma/client";
import { GraphQLContext } from "../context";

const event = {
  
  organization: async (
    parent: Event,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.organization.findUnique({
      where: { id: parent.organizerId || undefined },
    });
  },

  matches: async (
    parent: Event,
    _args: { }, // eslint-disable-line
    context: GraphQLContext
  ) => {
    return context.prisma.event.findUnique({
      where: { id: parent.id },
    }).matches();
  }

};

export default event;
