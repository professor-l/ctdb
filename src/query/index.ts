// Allocator for the query resolvers

import getPlayer from "./getPlayer"
import getAllPlayers from "./getAllPlayers"
import getOrganization from "./getOrganization"
import getEvent from "./getEvent"
import getEventsByName from "./getEventsByName"
import getAllOrganizations from "./getAllOrganizations"

const query = {
  info: () => "GraphQL API for CTDB",
  getPlayer: getPlayer,
  getAllPlayers: getAllPlayers,
  getOrganization: getOrganization,
  getAllOrganizations: getAllOrganizations,
  getEvent: getEvent,
  getEventsByName: getEventsByName,
}

export default query
