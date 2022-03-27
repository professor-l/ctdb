import { Prisma } from "@prisma/client";

import { GraphQLContext } from "../context";
import { prepare } from "./prepareCreator";

const createOrganization = async (
  parent: unknown,
  args: {
    name: string,
    description: string,
  },
  context: GraphQLContext
) => {
  const d = prepare.prepareOrganization(args);

  return await context.prisma.organization.create({
    data: d as Prisma.OrganizationCreateInput,
  });
};

export default createOrganization;
