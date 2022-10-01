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

  // highest ranked player (lowest number) - "starting point" for rank
  let topRank = Infinity;

  // update elo value for each one needing an update
  computedElosToUpdate.forEach(elo => {
    if (elo.rank < topRank && elo.rank > 0)
      topRank = elo.rank;

    const computed = computedElos.get(elo.playerId);

    updateComputedElo(elo, computedElos.get(elo.playerId));
  });

  // if top rank is still undefined, it must be 1
  if (topRank === Infinity) topRank = 1;

  // update rank
  computedElosToUpdate.sort((a, b) => (b.elo - a.elo));
  computedElosToUpdate.forEach((elo, i) => {
    elo.rank = topRank + i;
  });

  // write the computed elos to the database!
  await writeComputedElos(computedElosToUpdate, context);

  // add the snapshots, since they're less important
  await writeEloSnapshots(eloSnapshots, context);

  return 0;
};
