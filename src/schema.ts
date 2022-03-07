import { makeExecutableSchema } from "@graphql-tools/schema";
import { Pronoun, Playstyle, RomVersion } from "./context";
import typeDefs from "./schema.graphql";

import query from "./query";
import mutation from "./mutation";

const resolvers = {

  // enum resolvers
  Pronoun,
  Playstyle,
  RomVersion,

  // implemented seperately
  Query: query,
  Mutation: mutation,
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});