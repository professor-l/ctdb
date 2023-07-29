import { server } from '../src';
import { gql } from 'mercurius-codegen';
import state from './testState';
import { eloPipeline } from '../src/elo/pipeline';
import { contextFactory } from "../src/context";

export const testResolvers = () => describe("Test resolvers", () => {
  // update elo information
  //beforeAll(async () => {
  //  const context = await contextFactory();
  //  await eloPipeline(state.MATCH1.id, context);
  //});
  // TODO: restore when eloPipeline issues are addressed
  /*
  describe("EloSnapshot", () => {
    it("should resolve player", async () => {
      const query = gql`
        query ($eloName: String!) {
          getPlayerByName(eloName: $eloName) {
            eloHistory {
              id
              version
              victor
              newElo
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eloName: state.PLAYER1.eloName
        }
      });
      const parsed = JSON.parse(response["body"]);
      console.log(parsed);
      expect(parsed.data.gePlayerByName.eloHistory).toMatchObject(
        {
        }
      );
    });

    it("should resolve match", async () => {
      const query = gql`
        query (
        ) {
          ????(payload: {
          }) {
            id
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.updatePlayerName).toMatchObject(
        {
        }
      );
    });
  });
  */

  describe("Event", () => {
    it("should resolve org", async () => {
      const query = gql`
        query ($name: String!) {
          getEventByName(name: $name) {
            organization {
              id
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { name: state.EVENT2.name }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getEventByName.organization).toMatchObject(
        { id: state.ORG1.id }
      );
    });

    it("should resolve matches", async () => {
      const query = gql`
        query ($name: String!) {
          getEventByName(name: $name) {
            matches {
              id
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { name: state.EVENT2.name }
      });
      const parsed = JSON.parse(response["body"]);
      const matchIds = parsed.data.getEventByName.matches
        .map((match: { id: string }) => match.id);
      expect(matchIds.length).toEqual(3);
      expect(matchIds).toEqual(
        expect.arrayContaining([
          state.MATCH1.id,
          state.MATCH2.id,
          state.MATCH3.id,
        ])
      );
    });
  });

  describe("Game", () => {
    it("should resolve results", async () => {
      const query = gql`
        query {
          getAllMatches {
            id
            games {
              id
              results {
                id
              }
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      // i am sorry
      const resultIds = parsed.data.getAllMatches
        .filter((match: { id: string }) => match.id === state.MATCH1.id)[0]
        .games
        .filter((game: { id: string }) => game.id == state.GAME1.id)[0]
        .results.map((result: { id: string }) => result.id);
      expect(resultIds.length).toEqual(2);
      expect(resultIds).toEqual(
        expect.arrayContaining([
          state.RESULT1.id,
          state.RESULT2.id,
        ])
      );
    });

    it("should resolve match", async () => {
      const query = gql`
        query {
          getAllMatches {
            id
            games {
              id
              match {
                id
              }
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      const matchIds = parsed.data.getAllMatches
        .filter((match: { id: string }) => match.id === state.MATCH1.id)[0]
        .games.map((game: { match: { id: string } }) => game.match.id);
      expect(matchIds).toEqual(
        [ state.MATCH1.id, state.MATCH1.id ]
      );
    });
  });

  describe("Match", () => {
    it("should resolve games", async () => {
      const query = gql`
        query {
          getAllMatches {
            id
            games {
              id
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      const gameIds = parsed.data.getAllMatches
        .filter((match: { id: string }) => match.id === state.MATCH1.id)[0]
        .games.map((game: { id: string }) => game.id);
      expect(gameIds.length).toEqual(2);
      expect(gameIds).toEqual(
        expect.arrayContaining([
          state.GAME1.id,
          state.GAME2.id,
        ])
      );
    });

    it("should resolve event", async () => {
      const query = gql`
        query {
          getAllMatches {
            event {
              id
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      const eventIds = parsed.data.getAllMatches
        .map((match: { event: { id: string } }) => match.event.id);
      expect(eventIds.length).toEqual(4);
      expect(eventIds).toEqual(
        expect.arrayContaining([
          state.EVENT1.id,
          state.EVENT2.id,
        ])
      );
    });

    // TODO: add once eloPipeline issues are resolved
    /*
    it("should eloChanges", async () => {
      const query = gql`
        query (
        ) {
          ????(payload: {
          }) {
            id
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.updatePlayerName).toMatchObject(
        {
        }
      );
    });
    */
  });

  describe("Organization", () => {
    it("should resolve events", async () => {
      const query = gql`
        query ($name: String!) {
          getOrganizationByName(name: $name) {
            events {
              id
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          name: state.ORG1.name
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getOrganizationByName).toMatchObject(
        {
          events: [{ id: state.EVENT2.id }]
        }
      );
    });
  });

  describe("Player", () => {
    // TODO: fix eloPipeline
    /*
    it("should resolve eloHistory", async () => {
      const query = gql`
        query (
        ) {
          ????(payload: {
          }) {
            id
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.updatePlayerName).toMatchObject(
        {
        }
      );
    });
   */

    it("should resolve results", async () => {
      const query = gql`
        query ($eloName: String!) {
          getPlayerByName(eloName: $eloName) {
            results {
              id
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { eloName: state.PLAYER1.eloName }
      });
      const parsed = JSON.parse(response["body"]);
      const resultIds = parsed.data.getPlayerByName.results
        .map((result: { id: string }) => result.id);
      expect(resultIds).toEqual(
        expect.arrayContaining([ state.RESULT1.id, state.RESULT3.id ])
      );
    });
  });

  describe("Result", () => {
    it("should resolve player", async () => {
      const query = gql`
        query {
          getAllMatches {
            id
            games {
              id
              results {
                player {
                  id
                }
              }
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      const playerIds = parsed.data.getAllMatches
        .filter((match: { id: string }) => match.id === state.MATCH1.id)[0]
        .games
        .filter((game: { id: string }) => game.id === state.GAME1.id)[0]
        .results
        .map((result: { player: { id: string } }) => result.player.id);
      expect(playerIds.length).toEqual(2);
      expect(playerIds).toEqual(
        expect.arrayContaining([ state.PLAYER1.id, state.PLAYER2.id ])
      );
    });

    it("should resolve game", async () => {
      const query = gql`
        query {
          getAllMatches {
            id
            games {
              id
              results {
                game {
                  id
                }
              }
            }
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      const gameIds = parsed.data.getAllMatches
        .filter((match: { id: string }) => match.id === state.MATCH1.id)[0]
        .games
        .filter((game: { id: string }) => game.id === state.GAME1.id)[0]
        .results
        .map((result: { game: { id: string } }) => result.game.id);
      expect(gameIds.length).toEqual(2);
      expect(gameIds).toEqual(
        expect.arrayContaining([ state.GAME1.id ])
      );
    });
  });

});
