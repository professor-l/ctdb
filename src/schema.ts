import {
  makeExecutableSchema
} from "@graphql-tools/schema";

import {
  Pronoun,
  Playstyle,
  RomVersion,
  MatchType,
} from "./types";

import {
  EloSnapshot,
  Event,
  Game,
  Match,
  Organization,
  Player,
  Result,
} from "./resolvers";

import typeDefs from "./graphql_schema";
import Query from "./query";
import Mutation from "./mutation";

const resolvers = {

  // enum resolvers
  Pronoun,
  Playstyle,
  RomVersion,
  MatchType,

  // type resolvers
  EloSnapshot,
  Event,
  Game,
  Match,
  Organization,
  Player,
  Result,

  // implemented seperately
  Query,
  Mutation,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});