import { GraphQLContext } from "../context";

const getPlayer = async (
  parent: unknown,
  args: { eloName?: string, id?: string, },
  context: GraphQLContext
) => {
  
  /* 
  Prisma's default behavior is to ignore fields
  that are undefined. This is exactly what we
  want here, and it allows us to implement a very
  succinct getPlayer function.

  However, we may not specify multiple unique
  fields in a findUnique query. To circumvent
  this, we set id to be undefined iff name is
  defined, as seen below.
  */

  return context.prisma.player.findUnique({
    where: {
      eloName: args.eloName,
      id: args.eloName ? undefined : args.id,
    }
  });

};

export default getPlayer;