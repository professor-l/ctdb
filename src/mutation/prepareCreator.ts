// functions taking GraphQL query types and 
// converting them to prisma-ready types (above)

import {
  PreparedOrganizationData,
  PreparedResultData,
  PreparedGameData,
  PreparedMatchData,
  ResultCreator,
  GameCreator,
  MatchCreator,
  ConnectData,
  OrganizationCreator,
} from "../types"

export const prepare = {
  prepareOrganization: function({
    name,
    description,
    memberIds = [],
  }: OrganizationCreator): PreparedOrganizationData {
    const mappedMemberIds : ConnectData[] = memberIds.map((id: number): ConnectData => {
      return { id }
    })

    return  {
      name,
      description,
      members: {
        connect: mappedMemberIds,
      }
    }
  },

  prepareResult: function(
    result: ResultCreator
  ): PreparedResultData {

    return {
      player: {
        connect: { id: result.playerId },
      },
      rank: result.rank,
      score: result.score,
    }
  },

  prepareGame: function(
    game: GameCreator
  ): PreparedGameData {
  
    let d: PreparedGameData = {
      timestamp: game.timestamp,
    }
  
    if (game.results) {
      d.results = {
        create: game.results.map(
          result => this.prepareResult(result)
        )
      }
    }
  
    return d
  },

  prepareMatch: function(
    match: MatchCreator
  ): PreparedMatchData {
  
    let d: PreparedMatchData = {
      timestamp: match.timestamp,
      type: match.type,
      rom: match.rom,
    }
  
    if (match.games) {
      d.games = {
        create: match.games.map(
          game => this.prepareGame(game)
        )
      }
    }

    return d
  }
}