import { server } from '../src';
import { gql } from 'mercurius-codegen';
import state from './testState';
import { Playstyle, Pronoun } from '../src/types';

// state is updated to reflect newly created objects, so we can use it
// to store the ids of created objects (TODO: this is kind of bad?)
export const testCreators = () => describe("Test creators", () => {
  describe("createOrganization", () => {
    it ("should create an org", async () => {
      const query = gql`
        mutation ($orgName: String!) {
          createOrganization(payload: {
            name: $orgName,
            description: "I am a test org."
          }) {
            id
            name
          }
        }
      `;
  
      const response = await server.inject().post("/graphql").body({
        query,
        variables: { orgName: state.ORG1.name },
      });
      const parsed = JSON.parse(response["body"]);

      expect(parsed.data.createOrganization).toMatchObject(
        { name: state.ORG1.name }
      );
      state.ORG1.id = parsed.data.createOrganization.id;
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
          playstyles: [ Playstyle.ROLL, Playstyle.DAS ],
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
      expect(parsed.data.createPlayer.playstyles.sort()).toStrictEqual(
        [ Playstyle.ROLL, Playstyle.DAS ].sort()
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
          playstyles: [ Playstyle.DAS ],
          pronouns: [ Pronoun.HE ],
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
      console.log(parsed);
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

  /*
  describe("createMatchByEventName", () => {
    it("should ___", async () => {
    });
  });

  describe("createMatchByEventId", () => {
    it("should ___", async () => {
    });
  });

  describe("createGame", () => {
    it("should ___", async () => {
    });
  });

  describe("createResultByPlayerName", () => {
    it("should ___", async () => {
    });
  });

  describe("createResultByPlayerId", () => {
    it("should ___", async () => {
    });
  });
  */
});

