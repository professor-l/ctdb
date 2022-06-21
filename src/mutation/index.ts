import createPlayer from "./createPlayer";

import updatePlayerName from "./updatePlayerName";
import addPlaystyle from "./addPlaystyle";
import removePlaystyle from "./removePlaystyle";

import createPlayerComplete from "./createPlayerComplete";

import createOrganization from "./createOrganization";
import createEvent from "./createEvent";
import createMatchByEventName from "./createMatchByEventName";
import createMatchByEventId from "./createMatchByEventId";
import createGame from "./createGame";
import createResultByPlayerId from "./createResultByPlayerId";
import createResultByPlayerName from "./createResultByPlayerName";


const mutation = {
  createPlayer,
  updatePlayerName,
  addPlaystyle,
  removePlaystyle,

  createPlayerComplete,

  createOrganization,
  createEvent,
  createMatchByEventName,
  createMatchByEventId,
  createGame,
  createResultByPlayerId,
  createResultByPlayerName,
};

export default mutation;