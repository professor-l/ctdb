// Allocator for the query resolvers

import getPlayer from "./getPlayer";
import getAllPlayers from "./getAllPlayers";

import { Pronoun, Playstyle } from "../context";

const query = {
  info: () => "GraphQL API for CTDB",
  getPlayer: getPlayer,
  getAllPlayers: getAllPlayers,
}

export default query;