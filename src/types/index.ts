// mapping of enums
export enum Pronoun {
  HE = "HE",
  SHE = "SHE",
  THEY = "THEY"
}

export enum Playstyle {
  DAS = "DAS",
  TAP = "TAP",
  ROLL = "ROLL"
}

export enum RomVersion {
  NTSC = "NTSC",
  PAL = "PAL",
  NTSC_CUSTOM = "NTSC_CUSTOM",
  PAL_CUSTOM = "PAL_CUSTOM"
}

export enum MatchType {
  FRIENDLY = "FRIENDLY",
  COMPETITIVE = "COMPETITIVE",
  CHAMPIONSHIP = "CHAMPIONSHIP"
}

// mapping of creator types
// children always optional
// parents mandatory in API
export type OrganizationCreator = {
  name: string,
  description?: string,
  memberIds?: string[],
}

export type ResultCreator = {
  playerName: string,
  rank: number,
  score?: number,
}

export type GameCreator = {
  timestamp?: Date,
  results?: ResultCreator[],
}

export type MatchCreator = {
  timestamp: Date,
  games?: GameCreator[],
  video?: string,
  type?: MatchType,
  rom?: RomVersion,
}

export type EventCreator = {
  name: string,
  edition?: string,
  matches: MatchCreator[],
}

export type PlayerCreator = {
  name: string,
  playstyles?: Playstyle[]
  pronouns?: Pronoun[]
  country?: string
}

// data prepared for the prisma API

export type ConnectData = {
  id?: string,
  name?: string,
}

export type PreparedOrganizationData = {
  name: string,
  description?: string,
  members?: { connect: ConnectData[] }
}

export type PreparedResultData = {
  player: {
    connectOrCreate: {
      where: ConnectData,
      create: { name: string }
    }
  },
  game?: { connect: ConnectData },
  rank: number,
  score?: number,
}

export type PreparedGameData = {
  results?: {
    create: PreparedResultData[],
  },

  match?: { connect: ConnectData },
  timestamp?: Date,
}

export type PreparedMatchData = {
  games?: {
    create: PreparedGameData[],
  },
  event?: {
    connect: ConnectData,
  },
  type?: MatchType,
  rom?: RomVersion,
  timestamp: Date,
  video?: string,
}

export type PreparedEventData = {
  name: string,
  edition?: string,
  organizer?: {
    connect: ConnectData,
  },
  matches?: {
    create: PreparedMatchData[],
  },
}

