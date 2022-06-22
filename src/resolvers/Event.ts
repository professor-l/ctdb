import { Event } from "@prisma/client";
import { GraphQLContext } from "../context";

const event = {
  
  organization: async (
    parent: Event,
    context: GraphQLContext
  ) => {
    return context.prisma.organization.findUnique({
      where: { id: parent.organizerId || undefined },
    });
  },

  matches: async (
    parent: Event,
    context: GraphQLContext
  ) => {
    return context.prisma.match.findMany({
      where: { eventId: parent.id },
    });
  }

};

export default event;