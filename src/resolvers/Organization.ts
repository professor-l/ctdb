import { Organization } from "@prisma/client";
import { GraphQLContext } from "../context";

const org = {

  events: async (
    parent: Organization,
    context: GraphQLContext
  ) => {
    return context.prisma.event.findMany({
      where: { organizerId: parent.id },
    });
  },
  
};

export default org;