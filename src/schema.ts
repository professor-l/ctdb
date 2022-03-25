import { 
  makeExecutableSchema
} from "@graphql-tools/schema";

import { 
  Pronoun,
  Playstyle,
  RomVersion,
  MatchType
} from "./types";
import typeDefs from "./schema.graphql";
import query from "./query";
import mutation from "./mutation";

const resolvers = {

  // enum resolvers
  Pronoun,
  Playstyle,
  RomVersion,
  MatchType,

  // implemented seperately
  Query: query,
  Mutation: mutation,
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});