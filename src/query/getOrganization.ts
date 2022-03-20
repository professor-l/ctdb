import { GraphQLContext } from "../context";


const getOrganization = async (
  parent: unknown,
  args: {
    id?: number,
    name?: string,
  },
  context: GraphQLContext
) => {

  return context.prisma.organization.findUnique({
    where: {
      name: args.name,
      id: args.name ? undefined : args.id,
    }
  });
  
};

export default getOrganization;