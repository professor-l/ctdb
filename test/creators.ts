import { server } from '../src';
import { gql } from 'mercurius-codegen';
import globals from './globals';

export const testCreators = () => describe("Test creators", () => {
  describe("Mutation: createOrganization", () => {
    it ("should create an org", async () => {
      const query = gql`
        mutation ($orgName: String!) {
          createOrganization(payload: { name: $orgName, description: "I am a test org." }) {
            id
            name
          }
        }
      `;
  
      const response = await server.inject().post("/graphql").body({ query, variables: { orgName: globals.TEST_ORG_NAME } });
      const parsed = JSON.parse(response["body"]);

      expect(parsed.data.createOrganization).toMatchObject(
        { name: globals.TEST_ORG_NAME }
      );
    });
  });
  /*
  describe("Mutation: createPlayer", () => {
    it ("should create a player with no playstyle", async () => {
      const query = gql`
        mutation ($playerName: String!) {
          createPlayer(payload: { eloName: $playerName }) {
            id
            name
            eloName
            playstyle
            prounouns
            country
          }
        }
      `;
      const response = await server.inject().post("/graphql").body({ query, variables: { orgName: globals.TEST_ORG_NAME } });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.createOrganization).toMatchObject(
        { name: globals.TEST_ORG_NAME }
      );
    });

    it ("should create a player with one playstyle", async () => {
    });
  });

  describe("Mutation: createPlayerComplete", () => {
    it("should create a complete player", async () => {
    });
  });
  */
});

