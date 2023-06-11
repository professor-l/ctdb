import { Playstyle, Pronoun, MatchType, RomVersion } from "../src/types";

export default {
  ORG1: {
    name: "TETRIS TEST ORG",
    id: "",
  },
  PLAYER1: {
    eloName: "fractal161",
    id: "",
  },
  PLAYER2: {
    eloName: "EricICX",
    playstyles: [ Playstyle.ROLL, Playstyle.DAS ],
    id: "",
  },
  PLAYER3: {
    eloName: "Professor L",
    id: "",
  },
  PLAYER4: {
    eloName: "vandweller",
    name: "vandy",
    playstyles: [ Playstyle.DAS ],
    pronouns: [ Pronoun.HE ],
    country: "TX",
    id: "",
  },
  EVENT1: {
    name: "Classic Tetris Minutely",
    id: "",
  },
  EVENT2: {
    name: "Tetrio Cup",
    edition: "1989",
    orgId: "",
    start: "1989-03-14T12:00:00-05:00",
    end: "1989-03-14T16:00:00-05:00",
    id: "",
  },
  MATCH1: {
    eventName: "",
    timestamp: "1989-03-14T12:00:00-05:00",
    type: "",
    rom: "",
    id: ""
  },
  MATCH2: {
    eventName: "",
    timestamp: "1989-03-14T12:10:00-05:00",
    video: "TEST VIDEO LINK",
    type: MatchType.FRIENDLY,
    rom: RomVersion.NTSC_CUSTOM,
    id: ""
  },
  MATCH3: {
    eventId: "",
    timestamp: "1989-03-14T12:20:00-05:00",
    type: "",
    rom: "",
    id: ""
  },
  MATCH4: {
    eventId: "",
    timestamp: "1989-03-14T12:30:00-05:00",
    video: "ANOTHER VIDEO TEST",
    type: MatchType.CHAMPIONSHIP,
    rom: RomVersion.PAL,
    id: ""
  },
  GAME1: {
    matchId: "",
    id: ""
  },
  GAME2: {
    matchId: "",
    timestamp: "1989-03-14T12:03:00-05:00",
    id: ""
  },
  RESULT1: {
    rank: 1,
    playerName: "",
    gameId: "",
    id: ""
  },
  RESULT2: {
    rank: 2,
    playerName: "",
    gameId: "",
    playstyles: [ Playstyle.DAS ],
    score: 999999,
    id: ""
  },
  RESULT3: {
    rank: 2,
    playerId: "",
    gameId: "",
    id: ""
  },
  RESULT4: {
    rank: 1,
    playerId: "",
    gameId: "",
    playstyles: [ Playstyle.ROLL ],
    score: 654321,
    id: ""
  },
};
