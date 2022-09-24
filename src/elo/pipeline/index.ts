import { GraphQLContext } from "../../context";
import { pullComputedElosInRange, pullMatches, writeComputedElos, writeEloSnapshots } from "../util/dbInterface";
import { calculate } from "./calculate";
import { getComputedEloFromMatches } from "../util/extract";
import { updateComputedElo } from "./update";


export const eloPipeline = async (
  oldestMatchId: string,
  context: GraphQLContext
) => {

  // pull matches from database
  const matches = await pullMatches(oldestMatchId, context);

  // pull computed elos from database based on matches
  const computedElos = await getComputedEloFromMatches(matches, context);

  // run the calculation routine!
  const [eloSnapshots, create] = calculate(matches, computedElos, context);

  // min is 0 if we're creating new entires, because we have to update
  // ranks of everything _after_ the new bois
  const min = create ? 0 : (computedElos.get("min")?.elo || 0);
  const max = computedElos.get("max")?.elo || 0;

  // get all ComputedElos that need updating
  const computedElosToUpdate = await pullComputedElosInRange(
    min, max, context
  );

  let topRank = Infinity;

  computedElosToUpdate.forEach(elo => {
    if (elo.rank < topRank)
      topRank = elo.rank;

    updateComputedElo(elo, computedElos.get(elo.playerId));
  });

  computedElosToUpdate.sort((a, b) => (b.elo - a.elo));

  computedElosToUpdate.forEach((elo, i) => {
    elo.rank = topRank + i;
  });

  const updated = await writeComputedElos(computedElosToUpdate, context);

  // asynchronous, since
  writeEloSnapshots(eloSnapshots, context);

  return updated;
};
