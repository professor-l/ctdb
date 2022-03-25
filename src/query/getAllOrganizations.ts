import { GraphQLContext } from "../context";


const getAllOrganizations = async (
  parent: unknown,
  args: { }, // eslint-disable-line
  context: GraphQLContext
) => {
  return context.prisma.organization.findMany();
};

export default getAllOrganizations;
