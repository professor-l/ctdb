import { GraphQLContext } from "../context";


const getOrganizationByName = async (
  parent: unknown,
  args: {
    name: string,
  },
  context: GraphQLContext
) => {

  return context.prisma.organization.findUnique({
    where: {
      name: args.name,
    }
  });
  
};

export default getOrganizationByName;