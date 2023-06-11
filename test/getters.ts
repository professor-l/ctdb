import { server } from '../src';
import { gql } from 'mercurius-codegen';
import globals from './globals';

export const testGetters = () => describe("Test getters", () => {
  describe("Query: getAllOrganizations", () => {
    it ("should return all orgs", async () => {
      const query = gql`
        query {
          getAllOrganizations {
            name
          }
        }
      `;

      const expectedNames = { name: globals.TEST_ORG_NAME };

      const response = await server.inject().post("/graphql").body({ query });
      const parsed = JSON.parse(response["body"]);
      expect(parsed.data.getAllOrganizations).toContainEqual(expectedNames);
    });
  });
});
