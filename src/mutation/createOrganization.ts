import { GraphQLContext } from "../context";

const createOrganization = async (
  parent: unknown,
  args: {
    payload: {
      name: string,
      description: string,
    },
  },
  context: GraphQLContext
) => {

  const o = await context.prisma.organization.create({
    data: {
      name: args.payload.name,
      description: args.payload.description,
    }
  });

  return o;
};

export default createOrganization;
