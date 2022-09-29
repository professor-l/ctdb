import { sum } from "lodash";

import { 
  ComputedElo as ComputedEloIM,
  Submatch as SubmatchIM,
} from "../util/types";


// function to compute player-specific k-factor
// (max elo change per game for a player)

// currently: 250 / (total_matches + 96)^0.4, min. 18
export const k = (playerData: ComputedEloIM): number => {

  const matches = totalMatches(playerData);

  // natural max of ~40.3 (when matches = 0)
  const value = 250 / Math.pow((matches + 96), 0.4);
  
  // ensure final value is never <18
  // NOTE: doesn't actually dip below 18 until match #623
  return Math.max(value, 18);
};

export const oldRating = (playerData: ComputedEloIM): number => {
  return playerData.elo;
};

const factorial = (n: number): number => {
  if (n < 1) return 1;
  for (let i = n - 1; i > 1; --i)
    n *= i;
  
  return n;
};

// get total matches played by a given player
const totalMatches = (playerData: ComputedEloIM): number => {
  return (playerData.lossCount || 0) + (playerData.winCount || 0);
};

// returns id of player that  won match
export const winner = (matchData: SubmatchIM): string => {
  return (
    sum(matchData.winners) >= (matchData.winners.length / 2)
    ? matchData.player1Id : matchData.player0Id
  );
};

// returns value from 0-1 that == e value for players[0]
// to get value for players[1], take (1 - value)
export const expected = (player: ComputedEloIM, opponent: ComputedEloIM): number => {
  const exp = (opponent.elo - player.elo) / 400;

  return 1 / (1 + Math.pow(10, exp));
};

// custom coefficient that changes Elo weighting
// depending on the number of games played
export const g = (matchData: SubmatchIM): number => {
  let w = 0, l = 0;

  matchData.winners.forEach(g => {
    if (g == 0) ++w;
    else ++l;
  });

  if (l > w) {
    w += l;
    l = w - l;
    w -= l;
  }

  const g = w + l;

  return Math.sqrt(
    (factorial(g) * Math.pow(0.5, g)) /
    (factorial(w) * factorial(l))
  ) / 2;
};

// updateComputedElo
// export default async (
//   match: SubmatchIM,
//   players: [ComputedEloIM, ComputedEloIM],
// ) => {

//   const p0 = players[0], p1 = players[1];

//   const c0 = 
//     oldRating(p0) + (
//       k(p0) * g(match) * (
//         (winner(match) == p0.playerId ? 1 : 0) - 
//         expected(p0, p1)
//       )
//     )
//   ;

//   const c1 = 0 - c0;
//   updateComputedFromChange(p0, c0);
//   updateComputedFromChange(p1, c1);
// };

/*
1.  Pull match(es) data and player data for *all* players
2.  Calculate everything and update in memory
3.  For one match: 
    - if gap is closed from old ranks (i.e. underdog won), update
      all ranks between old ranks of the two players
    - otherwise, query db for ranks on either side of players' old
      and new Elos (each), and update ranks between each of those gaps,
      inclusive of those on either side
4.  For multiple matches:
    - query for Elo lower and upper bounds *in total* (see above)
    - update everything in between
*/