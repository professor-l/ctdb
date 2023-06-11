import { server } from '../src';
import { testCreators } from './creators';
import { testGetters } from './getters';
import { testUpdaters } from './updaters';
import { testResolvers } from './resolvers';


describe("Test queries", () => {
  beforeEach(async () => {
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  testCreators();
  testGetters();
  testUpdaters();
  testResolvers();

});
