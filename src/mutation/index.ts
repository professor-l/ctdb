import createPlayer from "./createPlayer";
import createOragnization from "./createOrganization";
import createResult from "./createResult";
import createGame from "./createGame";
import createMatch from "./createMatch";
import createEvent from "./createEvent";

const mutation = {
  createPlayer: createPlayer,
  createOrganization: createOragnization,
  createResult: createResult,
  createGame: createGame,
  createMatch: createMatch,
  createEvent: createEvent,
};

export default mutation;