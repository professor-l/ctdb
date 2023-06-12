import { server } from '../src';
import { gql } from 'mercurius-codegen';
import state from './testState';
import { Playstyle } from '../src/types';

export const testUpdaters = () => describe("Test updaters", () => {
  describe("updatePlayerName", () => {
    it("should update name", async () => {
      const query = gql`
        mutation (
          $oldEloName: String!,
          $newEloName: String!,
        ) {
          updatePlayerName(payload: {
            oldEloName: $oldEloName,
            newEloName: $newEloName,
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
          oldEloName: state.PLAYER1.eloName,
          newEloName: "DANIEL"
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.updatePlayerName).toMatchObject(
        {
          id: state.PLAYER1.id,
          name: null,
          eloName: "DANIEL",
          playstyles: [],
          pronouns: [],
          country: null
        }
      );
      state.PLAYER1.eloName = "DANIEL";
    });
  });

  describe("addPlaystyle", () => {
    it("should add playstyle, not already present", async () => {
      const query = gql`
        mutation (
          $eloName: String!,
          $playstyles: [Playstyle!]!,
        ) {
          addPlaystyle(payload: {
            eloName: $eloName,
            playstyles: $playstyles,
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
          eloName: state.PLAYER1.eloName,
          playstyles: [ Playstyle.ROLL ]
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.addPlaystyle).toMatchObject(
        {
          id: state.PLAYER1.id,
          name: null,
          eloName: state.PLAYER1.eloName,
          playstyles: [ Playstyle.ROLL ],
          pronouns: [],
          country: null
        }
      );
      state.PLAYER1.playstyles = [ Playstyle.ROLL ];
    });

    it("should add playstyle already present", async () => {
      const query = gql`
        mutation (
          $eloName: String!,
          $playstyles: [Playstyle!]!,
        ) {
          addPlaystyle(payload: {
            eloName: $eloName,
            playstyles: $playstyles,
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
      // at this point PLAYER2 has ROLL and DAS
      const response = await server.inject().post("/graphql").body({
        query,
        variables: {
          eloName: state.PLAYER2.eloName,
          playstyles: [ Playstyle.ROLL, Playstyle.TAP ]
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.addPlaystyle).toMatchObject(
        {
          id: state.PLAYER2.id,
          name: null,
          eloName: state.PLAYER2.eloName,
          pronouns: [],
          country: null
        }
      );
      // check playstyles
      expect(parsed.data.addPlaystyle.playstyles).toEqual(
        expect.arrayContaining([
          Playstyle.DAS,
          Playstyle.TAP,
          Playstyle.ROLL
        ])
      );
      state.PLAYER2.playstyles = [
        Playstyle.DAS,
        Playstyle.TAP,
        Playstyle.ROLL
      ];
    });
  });

  describe("removePlaystyle", () => {
    it("should remove playstyle already present", async () => {
      const query = gql`
        mutation (
          $eloName: String!,
          $playstyles: [Playstyle!]!,
        ) {
          removePlaystyle(payload: {
            eloName: $eloName,
            playstyles: $playstyles,
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
          playstyles: [ Playstyle.DAS ]
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.removePlaystyle).toMatchObject(
        {
          id: state.PLAYER2.id,
          name: null,
          eloName: state.PLAYER2.eloName,
          pronouns: [],
          country: null
        }
      );
      expect(parsed.data.removePlaystyle.playstyles.length).toEqual(2);
      expect(parsed.data.removePlaystyle.playstyles).toEqual(
        expect.arrayContaining([
          Playstyle.TAP,
          Playstyle.ROLL
        ])
      );
      state.PLAYER2.playstyles = [ Playstyle.ROLL, Playstyle.TAP ];
    });

    it("should remove playstyle that isn't present", async () => {
      const query = gql`
        mutation (
          $eloName: String!,
          $playstyles: [Playstyle!]!,
        ) {
          removePlaystyle(payload: {
            eloName: $eloName,
            playstyles: $playstyles,
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
          eloName: state.PLAYER1.eloName,
          playstyles: [ Playstyle.DAS ]
        }
      });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.removePlaystyle).toMatchObject(
        {
          id: state.PLAYER1.id,
          name: null,
          eloName: state.PLAYER1.eloName,
          playstyles: state.PLAYER1.playstyles,
          pronouns: [],
          country: null
        }
      );
    });
  });
});
