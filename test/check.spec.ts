import { server } from '../src';
import { gql } from 'mercurius-codegen';

const TEST_ORG_NAME = "TETRIS TEST ORG";

describe("Test queries", () => {
  beforeEach(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

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
  
      const response = await server.inject().post("/graphql").body({ query, variables: { orgName: TEST_ORG_NAME } });
      const parsed = JSON.parse(response["body"]);

      expect(parsed.data.createOrganization).toMatchObject(
        { name: TEST_ORG_NAME }
      );
    });
  });

  describe("Query: getAllOrganizations", () => {
    it ("should return all orgs", async () => {
      const query = gql`
        query {
          getAllOrganizations {
            name
          }
        }
      `;

      const expectedNames = { name: TEST_ORG_NAME };

      const response = await server.inject().post("/graphql").body({ query })
      const parsed = JSON.parse(response["body"])
      expect(parsed.data.getAllOrganizations).toContainEqual(expectedNames);
    });
  });
});
