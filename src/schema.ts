import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";
import { Prisma } from "@prisma/client";
import typeDefs from "./schema.graphql";

import query from "./query";
import mutation from "./mutation";

const resolvers = {
  Query: query,
  Mutation: mutation,
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});