import createPlayer from "./createPlayer";
import createOragnization from "./createOrganization";
import createResult from "./createResult";

const mutation = {
  createPlayer: createPlayer,
  createOrganization: createOragnization,
  createResult: createResult,
};

export default mutation;