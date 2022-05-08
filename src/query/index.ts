// Allocator for the query resolvers

import getPlayer from "./getPlayer";
import getAllPlayers from "./getAllPlayers";
import getAllMatches from "./getAllMatches";
import getMatchesByPlayer from "./getMatchesByPlayer";
import getOrganization from "./getOrganization";
import getEvent from "./getEvent";
import getEventsByName from "./getEventsByName";
import getAllOrganizations from "./getAllOrganizations";

const query = {
  info: () => "GraphQL API for CTDB",
  getPlayer: getPlayer,
  getAllPlayers: getAllPlayers,
  getAllMatches: getAllMatches,
  getMatchesByPlayer: getMatchesByPlayer,
  getOrganization: getOrganization,
  getAllOrganizations: getAllOrganizations,
  getEvent: getEvent,
  getEventsByName: getEventsByName,
};

export default query;
