import getPlayer from "./getPlayer";
import getAllPlayers from "./getAllPlayers";

const query = {
  info: () => "GraphQL API for CTDB",
  getPlayer: getPlayer,
  getAllPlayers: getAllPlayers,
}

export default query;