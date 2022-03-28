import createPlayer from "./createPlayer";
import createOragnization from "./createOrganization";
import createResult from "./createResult";
import createGame from "./createGame";
import createMatch from "./createMatch";
import createEvent from "./createEvent";

import updatePlayer from "./updatePlayer";

const mutation = {
  createPlayer,
  createOragnization,
  createResult,
  createGame,
  createMatch,
  createEvent,

  updatePlayer,
};

export default mutation;