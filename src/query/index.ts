// Allocator for the query resolvers

import getOrganizationByName from "./getOrganizationByName";
import getOrganizationById from "./getOrganizationById";
import getAllOrganizations from "./getAllOrganizations";

import getEventById from "./getEventById";
import getEventByName from "./getEventByName";
import getEventsByEdition from "./getEventsByEdition";

import getAllMatches from "./getAllMatches";
import getMatchesByPlayer from "./getMatchesByPlayer";

import getPlayerByEloName from "./getPlayerByEloName";
import getPlayerById from "./getPlayerById";
import getAllPlayers from "./getAllPlayers";

const query = {
  info: () => "GraphQL API for CTDB",
  getOrganizationByName,
  getOrganizationById,
  getAllOrganizations,

  getEventById,
  getEventByName,
  getEventsByEdition,

  getAllMatches,
  getMatchesByPlayer,

  getPlayerByEloName,
  getPlayerById,
  getAllPlayers,
};

export default query;
