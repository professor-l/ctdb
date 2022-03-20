import { GraphQLContext } from "../context";

const createOrganization = async (
  parent: unknown,
  args: {
    name: string,
    description: string,
  },
  context: GraphQLContext
) => {

  return await context.prisma.organization.create({
    data: {
      name: args.name,
      description: args.description,
    }
  });
};

export default createOrganization;