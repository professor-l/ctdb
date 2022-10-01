import { GraphQLContext } from "../../context";
import { computeMatch } from "./formula";
import { updateComputedFromChange } from "../util/dbInterface";
import { ComputedElo, EloSnapshot, Match } from "../util/types";


export const calculate = (
  matches: Match[],
  elos: Map<string, ComputedElo>,
  context: GraphQLContext
): [EloSnapshot[], boolean] => {

  let mustCreate = false;
  const snapshots: Map<string, EloSnapshot[]> = new Map();

  // guaranteed to loop through matches chronologically, since
  // matches comes from an ordered query
  matches.forEach(m => {
    m.submatches.forEach(s => {
      const elo0 = elos.get(s.player0Id);
      const elo1 = elos.get(s.player1Id);
      if (elo0 === undefined || elo1 === undefined) return;

      const [change0, change1] = computeMatch(s, elo0, elo1);

      const bigT: [[ComputedElo, number], [ComputedElo, number]] = 
        [[elo0, change0], [elo1, change1]];

      // for each player
      bigT.forEach(t => {
        const [e, c] = t;

        // computed elo objects are mutable when passed
        // welcome to TypeScript :')
        updateComputedFromChange(e, c);

        // update min and max
        if (e.elo < (elos.get("min")?.elo || Infinity))
          elos.set("min", e);

        if (e.elo > (elos.get("max")?.elo || -Infinity))
          elos.set("max", e);

        // mustCreate if there are new players, i.e.
        // if "unwritten" flag is set on ComputedElo object
        if (!mustCreate && e.unwritten)
          mustCreate = true;
        
        // all EloSnapshots for this player so far
        const snap = 
          snapshots.get(e.playerId) ||
          snapshots.set(e.playerId, []).get(e.playerId);
        
        // add another snapshot
        snap?.push({
          playerId: e.playerId,
          matchId: m.prismaObject.id,
          versionId: context.eloVersion.id,

          index: e.lossCount + e.winCount,
          victor: (c > 0),
          newElo: e.elo
        });
      });
    });
  });

  const finalSnaps: EloSnapshot[] = [];

  // for each player's set of snapshots
  snapshots.forEach(snaps => {
    // the most recent snapshot _is_ current
    snaps[snaps.length - 1].current = true;
    snaps.forEach(s => finalSnaps.push(s));
  });

  return [finalSnaps, mustCreate];

};