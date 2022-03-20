// Allocator for the query resolvers

import getPlayer from "./getPlayer";
import getAllPlayers from "./getAllPlayers";
import getOrganization from "./getOrganization";

const query = {
  info: () => "GraphQL API for CTDB",
  getPlayer: getPlayer,
  getAllPlayers: getAllPlayers,
  getOrganization: getOrganization,
}

export default query;