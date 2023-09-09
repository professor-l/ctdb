import { server } from '../src';
import { gql } from 'mercurius-codegen';
import state from './testState';
import { MatchType, RomVersion } from '../src/types';

export const testGetters = () => describe("Test getters", () => {
  describe("getOrganizationByName", () => {
    it ("should return org with correct name", async () => {
      const query = gql`
        query(
          $name: String!
        ) {
          getOrganizationByName(name: $name) {
            id
            name
            description
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: { name: state.ORG1.name },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getOrganizationByName).toMatchObject(
        {
          id: state.ORG1.id,
          name: state.ORG1.name,
          description: state.ORG1.description,
        }
      );
    });
  });

  describe("getOrganizationById", () => {
    it ("should return org with correct id", async () => {
      const query = gql`
        query($id: String!){
          getOrganizationById(id: $id) {
            id
            name
            description
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: { id: state.ORG2.id, },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getOrganizationById).toMatchObject(
        {
          id: state.ORG2.id,
          name: state.ORG2.name,
          description: state.ORG2.description,
        }
      );
    });
  });

  describe("getAllOrganizations", () => {
    it ("should return all orgs", async () => {
      // start by creating another organization
      const query = gql`
        query {
          getAllOrganizations {
            id
            name
            description
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getAllOrganizations.length).toEqual(2);
      expect(parsed.data.getAllOrganizations).toEqual(
        expect.arrayContaining([
          {
            id: state.ORG1.id,
            name: state.ORG1.name,
            description: state.ORG1.description,
          },
          {
            id: state.ORG2.id,
            name: state.ORG2.name,
            description: state.ORG2.description,
          },
        ])
      );
    });
  });

  describe("getEventByName", () => {
    it ("should return event", async () => {
      const query = gql`
        query(
          $name: String!
        ){
          getEventByName(
            name: $name
          ){
            id
            name
            edition
            start
            end
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: { name: state.EVENT1.name },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getEventByName).toMatchObject(
        {
          id: state.EVENT1.id,
          name: state.EVENT1.name,
          edition: null,
          start: null,
          end: null,
        }
      );
    });
  });

  describe("getEventById", () => {
    it ("should return event", async () => {
      const query = gql`
        query(
          $id: String!
        ){
          getEventById(
            id: $id
          ){
            id
            name
            edition
            start
            end
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: {
          id: state.EVENT2.id
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getEventById).toMatchObject(
        {
          id: state.EVENT2.id,
          name: state.EVENT2.name,
          edition: state.EVENT2.edition,
        }
      );
      // check dates
      expect(new Date(parsed.data.getEventById.start).toString())
        .toStrictEqual(
          new Date(state.EVENT2.start).toString()
        );
      expect(new Date(parsed.data.getEventById.end).toString())
        .toStrictEqual(
          new Date(state.EVENT2.end).toString()
        );
    });
  });


  describe("getEventsByEdition", () => {
    it ("should return all orgs", async () => {
      const query = gql`
        query(
          $edition: String!
        ){
          getEventsByEdition(
            edition: $edition
          ){
            id
            name
            edition
            start
            end
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: {
          edition: state.EVENT2.edition
        },
      });
      const parsed = JSON.parse(response["body"]);
      // TODO: I hate this
      expect(parsed.data.getEventsByEdition[0]).toMatchObject(
        {
          id: state.EVENT2.id,
          name: state.EVENT2.name,
          edition: state.EVENT2.edition,
        }
      );
      // check dates
      expect(new Date(parsed.data.getEventsByEdition[0].start).toString())
        .toStrictEqual(
          new Date(state.EVENT2.start).toString()
        );
      expect(new Date(parsed.data.getEventsByEdition[0].end).toString())
        .toStrictEqual(
          new Date(state.EVENT2.end).toString()
        );
    });
  });

  describe("getAllMatches", () => {
    it ("should return all matches", async () => {
      const query = gql`
        query {
          getAllMatches {
            id
            timestamp
            video
            type
            rom
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: {
        },
      });
      const parsed = JSON.parse(response["body"]);
      type matchType = {
        id: string,
        timestamp: string,
        video: string | null,
        type: MatchType,
        rom: RomVersion,
      };
      const matches = parsed.data.getAllMatches
        .map((match: matchType) => {
          return {
            ...match,
            timestamp: new Date(match.timestamp).toString()
          };
        });
      expect(matches).toEqual(
        expect.arrayContaining([
          {
            id: state.MATCH1.id,
            timestamp: new Date(state.MATCH1.timestamp).toString(),
            video: state.MATCH1.video,
            type: state.MATCH1.type,
            rom: state.MATCH1.rom,
          },
          {
            id: state.MATCH2.id,
            timestamp: new Date(state.MATCH2.timestamp).toString(),
            video: state.MATCH2.video,
            type: state.MATCH2.type,
            rom: state.MATCH2.rom,
          },
          {
            id: state.MATCH3.id,
            timestamp: new Date(state.MATCH3.timestamp).toString(),
            video: state.MATCH3.video,
            type: state.MATCH3.type,
            rom: state.MATCH3.rom,
          },
          {
            id: state.MATCH4.id,
            timestamp: new Date(state.MATCH4.timestamp).toString(),
            video: state.MATCH4.video,
            type: state.MATCH4.type,
            rom: state.MATCH4.rom,
          },
        ])
      );
    });
  });

  describe("getMatchesByPlayer", () => {
    it ("should return all matches for the player", async () => {
      const query = gql`
        query($eloName: String!) {
          getMatchesByPlayer(eloName: $eloName) {
            id
            timestamp
            video
            type
            rom
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: {
          eloName: state.PLAYER1.eloName
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getMatchesByPlayer.length).toEqual(1);
      expect(parsed.data.getMatchesByPlayer[0]).toMatchObject(
        {
          id: state.MATCH1.id,
          video: state.MATCH1.video,
          type: state.MATCH1.type,
          rom: state.MATCH1.rom,
        }
      );
      // check dates
      expect(new Date(parsed.data.getMatchesByPlayer[0].timestamp).toString())
        .toStrictEqual(
          new Date(state.MATCH1.timestamp).toString()
        );
    });
  });

  describe("getPlayerByName", () => {
    it ("should return player", async () => {
      const query = gql`
        query(
          $eloName: String!
        ){
          getPlayerByName(
            eloName: $eloName
          ){
            id
            eloName
            name
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: {
          eloName: state.PLAYER1.eloName
        },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getPlayerByName).toMatchObject(
        {
          id: state.PLAYER1.id,
          eloName: state.PLAYER1.eloName,
          name: null,
          playstyles: [],
          pronouns: [],
          country: null
        }
      );
    });
  });

  describe("getPlayerById", () => {
    it ("should return player", async () => {
      const query = gql`
        query($id: String!){
          getPlayerById(id: $id){
            id
            eloName
            name
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: { id: state.PLAYER4.id },
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getPlayerById).toMatchObject(
        {
          id: state.PLAYER4.id,
          eloName: state.PLAYER4.eloName,
          name: state.PLAYER4.name,
          country: state.PLAYER4.country,
        }
      );
      expect(parsed.data.getPlayerById.playstyles).toStrictEqual(
          expect.arrayContaining(state.PLAYER4.playstyles)
        );
      expect(parsed.data.getPlayerById.pronouns).toStrictEqual(
          expect.arrayContaining(state.PLAYER4.pronouns)
        );
    });
  });

  describe("getAllPlayers", () => {
    it ("should return all players", async () => {
      const query = gql`
        query {
          getAllPlayers {
            id
            eloName
            name
            playstyles
            pronouns
            country
          }
        }
      `;
      const response = await server.inject()
       .post("/graphql").body({
        query,
        variables: {
        },
      });
      const parsed = JSON.parse(response["body"]);
      // TODO: this is kinda bad since collections (e.g. playstyles) are being
      // checked assuming the order must be preserved, but is probably fine lol
      expect(parsed.data.getAllPlayers).toEqual(
        expect.arrayContaining([
          state.PLAYER1, state.PLAYER2, state.PLAYER3, state.PLAYER4
        ])
      );
    });
  });
});
