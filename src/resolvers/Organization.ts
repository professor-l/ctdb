import { Organization } from "@prisma/client";
import { GraphQLContext } from "../context";

const org = {

  events: async (
    parent: Organization,
    _args: { }, // eslint-disable-line
    context: GraphQLContext,
  ) => {
    return context.prisma.organization.findUnique({
      where: { id: parent.id },
    }).events();
  },
  
};

export default org;
