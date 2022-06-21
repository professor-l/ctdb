import { GraphQLContext } from "../context";

const createEvent = async (
  parent: unknown,
  args: {
    payload: {
      name: string,
      edition?: string,
      organizerId?: string,
      start?: Date,
      end?: Date,
    }
  },
  context: GraphQLContext
) => {

  const e = context.prisma.event.create({
    data: args.payload
  });

  return e;
};

export default createEvent;