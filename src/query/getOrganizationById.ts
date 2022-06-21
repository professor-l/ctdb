import { GraphQLContext } from "../context";


const getOrganizationById = async (
  parent: unknown,
  args: {
    id: string,
  },
  context: GraphQLContext
) => {

  return context.prisma.organization.findUnique({
    where: {
      id: args.id,
    }
  });
  
};

export default getOrganizationById;