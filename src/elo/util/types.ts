import { 
  Match as MatchP,
  Game,
  Result,
  MatchType,
  RomVersion
} from "@prisma/client";

// in-memory Elo snapshot values
export type EloSnapshot = {
  playerId: string;
  matchId: string;
  versionId: string;

  index: number;
  victor: boolean;
  newElo: number;
  current?: boolean;
}

// in-memory computed values, excluding rank
export type ComputedElo = {
  playerId:   string;

  elo:        number; // float
  highestElo: number; // float
  winCount:   number; // int
  lossCount:  number; // int
  lastMatch:  Date;

  // true if this playerId has no associated ComputedElo entry
  // i.e. if the player has not yet played a recorded match
  unwritten?: boolean;
};

// in-memory match values
export type Submatch = {
  // 0 or 1 depending on player
  winners:   number[];
  // losing score for each game
  scores:    number[];
  player0Id: string;
  player1Id: string;
};

// in-memory wrapper for a match
// will wrap a single Match object if it's 1v1
// otherwise multiple to handle Elo calculations for
// matches with many players

// NOTE: the database/API/whatever parser will
// decouple large matches into sub-matches here
export type Match = {
  // if not pulled from database, can be anything
  matchId?:       string;
  type?:          MatchType;
  rom?:           RomVersion;
  timestamp?:     Date;
  submatches:     Submatch[];
  prismaObject:   MatchP & {games: (Game & {results: Result[]})[]};
}
