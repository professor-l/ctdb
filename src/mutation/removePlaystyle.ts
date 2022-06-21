import { difference } from "lodash";

import { GraphQLContext } from "../context";
import { Playstyle } from "../types";

const removePlaystyle = async (
  parent: unknown,
  args: {
    payload: {
      eloName: string,
      playstyles: Playstyle[],
    },
  },
  context: GraphQLContext
) => {

  let p = await context.prisma.player.findUnique({
    where: { eloName: args.payload.eloName },
  });

  if (p === null) {
    return null;
  }

  const styles = difference(p.playstyles, args.payload.playstyles);
  
  p = await context.prisma.player.update({
    where: { eloName: args.payload.eloName },
    data: {
      playstyles: {
        set: styles,
      },
    },
  });

  return p;

};

export default removePlaystyle;