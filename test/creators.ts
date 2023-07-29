import { server } from '../src';
import { gql } from 'mercurius-codegen';
import state from './testState';
import { MatchType, RomVersion } from '../src/types';

// state is updated to reflect newly created objects, so we can use it
// to store the ids of created objects (TODO: this is kind of bad?)
export const testCreators = () => describe("Test creators", () => {
  describe("createOrganization", () => {
    it ("should create an org", async () => {
      const query = gql`
        mutation (
          $orgName: String!,
          $desc: String!
        ) {
          createOrganization(payload: {
            name: $orgName,
            description: $desc
          }) {
            id
            name
            description
          }
        }
      `;
  
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          orgName: state.ORG1.name,
          desc: state.ORG1.description,
        },
      });
      const parsed = JSON.parse(response["body"]);

      expect(parsed.data.createOrganization).toMatchObject(
        {
          name: state.ORG1.name,
          description: state.ORG1.description,
        }
      );
      state.ORG1.id = parsed.data.createOrganization.id;

      // create second org for later usage, no need to test
      const otherResponse = await server.inject().post("/graphql").body({
        query,
        variables: {
          orgName: state.ORG2.name,
          desc: state.ORG2.description,
        },
      });
      const otherParsed = JSON.parse(otherResponse["body"]);
      state.ORG2.id = otherParsed.data.createOrganization.id;
    });
  });

  describe("createPlayer", () => {
    it ("should create a player with no playstyle", async () => {
      const query = gql`
        mutation ($eloName: String!) {
          createPlayer(payload: { eloName: $eloName }) {
            id
            name
            eloName
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { eloName: state.PLAYER1.eloName }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createPlayer).toMatchObject(
        {
          name: null,
          eloName: state.PLAYER1.eloName,
          playstyles: [],
          pronouns: [],
          country: null
        }
      );
      state.PLAYER1.id = parsed.data.createPlayer.id;
    });

    it ("should create a player with at least one playstyle", async () => {
      const query = gql`
        mutation ($eloName: String!, $playstyles: [Playstyle!]) {
          createPlayer(payload: {
            eloName: $eloName,
            playstyles: $playstyles
          }) {
            id
            name
            eloName
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eloName: state.PLAYER2.eloName,
          playstyles: state.PLAYER2.playstyles,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createPlayer).toMatchObject(
        {
          name: null,
          eloName: state.PLAYER2.eloName,
          pronouns: [],
          country: null
        }
      );
      // separate check for arrays
      expect(parsed.data.createPlayer.playstyles.length).toEqual(2);
      expect(parsed.data.createPlayer.playstyles).toEqual(
        expect.arrayContaining(state.PLAYER2.playstyles)
      );
      state.PLAYER2.id = parsed.data.createPlayer.id;
    });
  });

  describe("createPlayerComplete", () => {
    it("should create a complete player, no name/playstyle/pronoun/country", async () => {
      const query = gql`
        mutation ($eloName: String!) {
          createPlayerComplete(payload: { eloName: $eloName }) {
            id
            name
            eloName
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { eloName: state.PLAYER3.eloName },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createPlayerComplete).toMatchObject(
        {
          name: null,
          eloName: state.PLAYER3.eloName,
          playstyles: [],
          pronouns: [],
          country: null
        }
      );
      state.PLAYER3.id = parsed.data.createPlayerComplete.id;
    });

    it("should create a complete player with name/playstyle/pronouns/country", async() => {
      const query = gql`
        mutation (
          $eloName: String!,
          $name: String!,
          $playstyles: [Playstyle!],
          $pronouns: [Pronoun!],
          $country: String!
        ) {
          createPlayerComplete(payload: {
            eloName: $eloName,
            name: $name,
            playstyles: $playstyles,
            pronouns: $pronouns,
            country: $country
          }) {
            id
            name
            eloName
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eloName: state.PLAYER4.eloName,
          name: state.PLAYER4.name,
          playstyles: state.PLAYER4.playstyles,
          pronouns: state.PLAYER4.pronouns,
          country: "TX",
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createPlayerComplete).toMatchObject(
        {
          eloName: state.PLAYER4.eloName,
          name: state.PLAYER4.name,
          playstyles: state.PLAYER4.playstyles,
          pronouns: state.PLAYER4.pronouns,
          country: state.PLAYER4.country,
        }
      );
      state.PLAYER4.id = parsed.data.createPlayerComplete.id;
    });
  });

  describe("createEvent", () => {
    it("should create event, no edition/organizer/start/end", async () => {
      const query = gql`
        mutation(
          $name: String!
        ){
          createEvent(payload: {
            name: $name
          })
          {
            id
            name
            edition
            start
            end
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          name: state.EVENT1.name
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createEvent).toMatchObject(
        {
          name: state.EVENT1.name,
          edition: null,
          start: null,
          end: null,
        }
      );
      state.EVENT1.id = parsed.data.createEvent.id;
    });

    it("should create event with edition/organizer/start/end", async () => {
      const query = gql`
        mutation(
          $name: String!,
          $edition: String!,
          $orgId: String!,
          $start: DateTime!,
          $end: DateTime!,
        ){
          createEvent(payload: {
            name: $name,
            edition: $edition,
            organizerId: $orgId,
            start: $start,
            end: $end,
          })
          {
            id
            name
            edition
            start
            end
          }
        }
      `;
      state.EVENT2.orgId = state.ORG1.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          name: state.EVENT2.name,
          edition: state.EVENT2.edition,
          orgId: state.EVENT2.orgId,
          start: state.EVENT2.start,
          end: state.EVENT2.end,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createEvent).toMatchObject(
        {
          name: state.EVENT2.name,
          edition: state.EVENT2.edition,
        }
      );
      // check dates
      expect(new Date(parsed.data.createEvent.start).toString())
        .toStrictEqual(
          new Date(state.EVENT2.start).toString()
        );
      expect(new Date(parsed.data.createEvent.end).toString())
        .toStrictEqual(
          new Date(state.EVENT2.end).toString()
        );
      state.EVENT2.id = parsed.data.createEvent.id;
    });
  });

  describe("createMatchByEventName", () => {
    it("should create match, no video/type/rom", async () => {
      const query = gql`
        mutation(
          $eventName: String!,
          $timestamp: DateTime!
        ){
          createMatchByEventName(payload: {
            eventName: $eventName,
            timestamp: $timestamp
          })
          {
            id
            timestamp
            video
            type
            rom
          }
        }
      `;
      state.MATCH1.eventName = state.EVENT2.name;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eventName: state.MATCH1.eventName,
          timestamp: state.MATCH1.timestamp
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createMatchByEventName).toMatchObject(
        {
          video: null,
          type: MatchType.COMPETITIVE,
          rom: RomVersion.NTSC,
        }
      );
      // check timestamp
      expect(new Date(parsed.data.createMatchByEventName.timestamp).toString())
        .toStrictEqual(
          new Date(state.MATCH1.timestamp).toString()
        );
      state.MATCH1.id = parsed.data.createMatchByEventName.id;
      state.MATCH1.type = parsed.data.createMatchByEventName.type;
      state.MATCH1.rom = parsed.data.createMatchByEventName.rom;
    });

    it("should create match with video/type/rom", async () => {
      const query = gql`
        mutation(
          $eventName: String!,
          $timestamp: DateTime!,
          $video: String!,
          $type: MatchType!,
          $rom: RomVersion!,
        ){
          createMatchByEventName(payload: {
            eventName: $eventName,
            timestamp: $timestamp,
            video: $video,
            type: $type,
            rom: $rom,
          })
          {
            id
            timestamp
            video
            type
            rom
          }
        }
      `;
      state.MATCH2.eventName = state.EVENT2.name;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eventName: state.MATCH2.eventName,
          timestamp: state.MATCH2.timestamp,
          video: state.MATCH2.video,
          type: state.MATCH2.type,
          rom: state.MATCH2.rom,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createMatchByEventName).toMatchObject(
        {
          video: state.MATCH2.video,
          type: state.MATCH2.type,
          rom: state.MATCH2.rom,
        }
      );
      // check timestamp
      expect(new Date(parsed.data.createMatchByEventName.timestamp).toString())
        .toStrictEqual(
          new Date(state.MATCH2.timestamp).toString()
        );
      state.MATCH2.id = parsed.data.createMatchByEventName.id;
    });
  });

  describe("createMatchByEventId", () => {
    it("should create event, no video/type/rom", async () => {
      const query = gql`
        mutation(
          $eventId: String!,
          $timestamp: DateTime!
        ){
          createMatchByEventId(payload: {
            eventId: $eventId,
            timestamp: $timestamp
          })
          {
            id
            timestamp
            video
            type
            rom
          }
        }
      `;
      state.MATCH3.eventId = state.EVENT2.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eventId: state.MATCH3.eventId,
          timestamp: state.MATCH3.timestamp,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createMatchByEventId).toMatchObject(
        {
          video: null,
          type: MatchType.COMPETITIVE,
          rom: RomVersion.NTSC,
        }
      );
      // check timestamp
      expect(new Date(parsed.data.createMatchByEventId.timestamp).toString())
        .toStrictEqual(
          new Date(state.MATCH3.timestamp).toString()
        );
      state.MATCH3.id = parsed.data.createMatchByEventId.id;
      state.MATCH3.type = parsed.data.createMatchByEventId.type;
      state.MATCH3.rom = parsed.data.createMatchByEventId.rom;
    });

    it("should create event with video/type/rom", async () => {
      const query = gql`
        mutation(
          $eventId: String!,
          $timestamp: DateTime!,
          $video: String!,
          $type: MatchType!,
          $rom: RomVersion!,
        ){
          createMatchByEventId(payload: {
            eventId: $eventId,
            timestamp: $timestamp,
            video: $video,
            type: $type,
            rom: $rom,
          })
          {
            id
            timestamp
            video
            type
            rom
          }
        }
      `;
      state.MATCH4.eventId = state.EVENT1.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eventId: state.MATCH4.eventId,
          timestamp: state.MATCH4.timestamp,
          video: state.MATCH4.video,
          type: state.MATCH4.type,
          rom: state.MATCH4.rom,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createMatchByEventId).toMatchObject(
        {
          video: state.MATCH4.video,
          type: state.MATCH4.type,
          rom: state.MATCH4.rom,
        }
      );
      // check timestamp
      expect(new Date(parsed.data.createMatchByEventId.timestamp).toString())
        .toStrictEqual(
          new Date(state.MATCH4.timestamp).toString()
        );
      state.MATCH4.id = parsed.data.createMatchByEventId.id;
    });
  });

  describe("createGame", () => {
    it("should create game, no timestamp", async () => {
      const query = gql`
        mutation($matchId: String!){
          createGame(payload: {
            matchId: $matchId
          })
          {
            id
            timestamp
          }
        }
      `;
      state.GAME1.matchId = state.MATCH1.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { matchId: state.GAME1.matchId },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createGame).toMatchObject(
        {
          timestamp: null,
        }
      );
      state.GAME1.id = parsed.data.createGame.id;
    });

    it("should create game with timestamp", async () => {
      const query = gql`
        mutation($matchId: String!, $timestamp: DateTime!){
          createGame(payload: {
            matchId: $matchId,
            timestamp: $timestamp
          })
          {
            id
            timestamp
          }
        }
      `;
      state.GAME2.matchId = state.MATCH1.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          matchId: state.GAME2.matchId,
          timestamp: state.GAME2.timestamp
        },
      });
      const parsed = JSON.parse(response["body"]);
      // check timestamp
      expect(new Date(parsed.data.createGame.timestamp).toString())
        .toStrictEqual(
          new Date(state.GAME2.timestamp).toString()
        );
      state.GAME2.id = parsed.data.createGame.id;
    });
  });

  describe("createResultByPlayerName", () => {
    it("should create result, no playstyle/score", async () => {
      const query = gql`
        mutation(
          $gameId: String!,
          $playerName: String!,
          $rank: Int!
        ){
          createResultByPlayerName(payload: {
            gameId: $gameId,
            playerName: $playerName,
            rank: $rank
          })
          {
            id
            rank
            playstyles
            score
          }
        }
      `;
      state.RESULT1.gameId = state.GAME1.id;
      state.RESULT1.playerName = state.PLAYER1.eloName;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          gameId: state.RESULT1.gameId,
          playerName: state.RESULT1.playerName,
          rank: state.RESULT1.rank,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createResultByPlayerName).toMatchObject(
        {
          rank: state.RESULT1.rank,
          playstyles: [],
          score: null,
        }
      );
      state.RESULT1.id = parsed.data.createResultByPlayerName.id;
    });

    it("should create result with playstyle/score", async () => {
      const query = gql`
        mutation(
          $gameId: String!,
          $playerName: String!,
          $rank: Int!,
          $playstyles: [Playstyle!],
          $score: Int!
        ){
          createResultByPlayerName(payload: {
            gameId: $gameId,
            playerName: $playerName,
            rank: $rank,
            playstyles: $playstyles,
            score: $score,
          })
          {
            id
            rank
            playstyles
            score
          }
        }
      `;
      state.RESULT2.gameId = state.GAME1.id;
      state.RESULT2.playerName = state.PLAYER2.eloName;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          gameId: state.RESULT2.gameId,
          playerName: state.RESULT2.playerName,
          rank: state.RESULT2.rank,
          playstyles: state.RESULT2.playstyles,
          score: state.RESULT2.score
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createResultByPlayerName).toMatchObject(
        {
          rank: state.RESULT2.rank,
          score: state.RESULT2.score,
        }
      );
      expect(parsed.data.createResultByPlayerName.playstyles.length).toEqual(1);
      expect(parsed.data.createResultByPlayerName.playstyles).toStrictEqual(
          expect.arrayContaining(state.RESULT2.playstyles)
        );
      state.RESULT2.id = parsed.data.createResultByPlayerName.id;
    });
  });

  describe("createResultByPlayerId", () => {
    it("should create result, no playstyles/score", async () => {
      const query = gql`
        mutation(
          $gameId: String!,
          $playerId: String!,
          $rank: Int!
        ){
          createResultByPlayerId(payload: {
            gameId: $gameId,
            playerId: $playerId,
            rank: $rank
          })
          {
            id
            rank
            playstyles
            score
          }
        }
      `;
      state.RESULT3.gameId = state.GAME2.id;
      state.RESULT3.playerId = state.PLAYER1.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          gameId: state.RESULT3.gameId,
          playerId: state.RESULT3.playerId,
          rank: state.RESULT3.rank,
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createResultByPlayerId).toMatchObject(
        {
          rank: state.RESULT3.rank,
          playstyles: [],
          score: null,
        }
      );
      state.RESULT3.id = parsed.data.createResultByPlayerId.id;
    });

    it("should create result with playstyle/score", async () => {
      const query = gql`
        mutation(
          $gameId: String!,
          $playerId: String!,
          $rank: Int!,
          $playstyles: [Playstyle!],
          $score: Int!
        ){
          createResultByPlayerId(payload: {
            gameId: $gameId,
            playerId: $playerId,
            rank: $rank,
            playstyles: $playstyles,
            score: $score,
          })
          {
            id
            rank
            playstyles
            score
          }
        }
      `;
      state.RESULT4.gameId = state.GAME2.id;
      state.RESULT4.playerId = state.PLAYER2.id;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          gameId: state.RESULT4.gameId,
          playerId: state.RESULT4.playerId,
          rank: state.RESULT4.rank,
          playstyles: state.RESULT4.playstyles,
          score: state.RESULT4.score
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createResultByPlayerId).toMatchObject(
        {
          rank: state.RESULT4.rank,
          score: state.RESULT4.score,
        }
      );
      expect(parsed.data.createResultByPlayerId.playstyles.length).toEqual(1);
      expect(parsed.data.createResultByPlayerId.playstyles).toStrictEqual(
          expect.arrayContaining(state.RESULT4.playstyles)
        );
      state.RESULT4.id = parsed.data.createResultByPlayerId.id;
    });
  });

});

