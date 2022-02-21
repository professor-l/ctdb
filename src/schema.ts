import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";
import { Prisma } from "@prisma/client";
import typeDefs from "./schema.graphql";

const resolvers = {
    Query: {
        info: () => "GraphQL API for CTDB",
        getPlayer: async (
            parent: unknown,
            args: { name?: string, id?: number, },
            context: GraphQLContext,
        ) => {

            if (args.name) {
                return context.prisma.player.findUnique({
                    where: {
                        name: args.name,
                    }
                });
            }

            else if (args.id) {
                return context.prisma.player.findUnique({
                    where: {
                        id: args.id,
                    }
                });
            }

            // TODO: throw error
        }
    },

    Mutation: {
        createPlayer: async (
            parent: unknown,
            args: { name: string, country?: string },
            context: GraphQLContext,
        ) => {

            let newPlayer: Prisma.PlayerCreateInput = {
                name: args.name,
            };

            if (args.country)
                newPlayer.country = args.country;

            return await context.prisma.player.create({
                data: newPlayer,
            });
        },
    },
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});