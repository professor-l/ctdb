import { ComputedElo, Submatch } from "../util/types";
import { 
  oldRating, k, g, winner,
  expected
} from "./compute";


export const computeMatch = (
  match: Submatch,
  player0Elo: ComputedElo,
  player1Elo: ComputedElo,
): [number, number] => {

  const change0 = (
    k(player0Elo) * g(match) * (
      (winner(match) == player0Elo.playerId ? 1 : 0) -
      expected(player0Elo, player1Elo)
    )
  );

  const change1 = 0 - change0;

  return [change0, change1];
};
