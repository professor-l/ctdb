// functions taking GraphQL query types and 
// converting them to prisma-ready types (above)

import {
  PreparedOrganizationData,
  PreparedResultData,
  PreparedGameData,
  PreparedMatchData,
  PreparedEventData,
  ResultCreator,
  GameCreator,
  MatchCreator,
  ConnectData,
  OrganizationCreator,
  EventCreator,
} from "../types";

export const prepare = {
  prepareOrganization: function({
    name,
    description,
    memberIds = [],
  }: OrganizationCreator): PreparedOrganizationData {

    const mappedMemberIds : ConnectData[] = memberIds.map(
      (id: string): ConnectData => { return { id }; }
    );

    return  {
      name,
      description,
      members: {
        connect: mappedMemberIds,
      }
    };
  },

  prepareResult: function(
    result: ResultCreator
  ): PreparedResultData {

    return {
      player: {
        connectOrCreate: {
          where: { name: result.playerName },
          create: {
            name: result.playerName,
          }
        },
      },
      rank: result.rank,
      score: result.score,
    };
  },

  prepareGame: function(
    game: GameCreator
  ): PreparedGameData {
  
    const d: PreparedGameData = {
      timestamp: game.timestamp,
    };
  
    if (game.results) {
      d.results = {
        create: game.results.map(
          result => this.prepareResult(result)
        )
      };
    }
  
    return d;
  },

  prepareMatch: function(
    match: MatchCreator
  ): PreparedMatchData {
  
    const d: PreparedMatchData = {
      timestamp: match.timestamp,
      type: match.type,
      rom: match.rom,
    };
  
    if (match.games) {
      d.games = {
        create: match.games.map(
          game => this.prepareGame(game)
        )
      };
    }

    return d;
  },

  prepareEvent: function(
    event: EventCreator
  ): PreparedEventData {

    const d: PreparedEventData = {
      name: event.name,
      edition: event.edition,
    };

    if (event.matches) {
      d.matches = {
        create: event.matches.map(m => this.prepareMatch(m))
      };
    }

    return d;
  }
};
