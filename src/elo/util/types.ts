import { 
  Match as MatchP,
  Game,
  Result,
  MatchType,
  RomVersion
} from "@prisma/client";


// in-memory computed values, excluding rank
export type ComputedElo = {
  playerId:    string;

  elo:         number; // float
  highestElo?: number; // float
  winCount?:   number; // int
  lossCount?:  number; // int
  lastMatch?:  Date;
};

// in-memory match values
export type Match = {
  // 0 or 1 depending on player
  winners:   number[];
  // losing score for each game
  scores:   number[];
  player0Id: string;
  player1Id: string;
};

// in-memory wrapper for a match
// will wrap a single Match object if it's 1v1
// otherwise multiple to handle Elo calculations for
// matches with many players

// NOTE: the database/API/whatever parser will
// decouple large matches into sub-matches here
export type MatchWrapper = {
  // if not pulled from database, can be anything
  matchId?:     string;
  type?:        MatchType;
  rom?:         RomVersion;
  timestamp?:   Date;
  submatches:   Match[];
  prismaObject: MatchP & {games: (Game & {results: Result[]})[]};
}
