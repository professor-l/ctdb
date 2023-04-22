import { Match } from "@prisma/client";
import { GraphQLContext } from "../context";

const match = {

  games: async (
    parent: Match,
    context: GraphQLContext
  ) => {
    return context.prisma.match.findUnique({
      where: { id: parent.id },
    }).games();
  },

  event: async (
    parent: Match,
    context: GraphQLContext
  ) => {
    return context.prisma.event.findUnique({
      where: { id: parent.eventId || undefined },
    });
  },
  //TODO: put this back once fix id:parent.eventId
  // event: async (
  //   parent: Match,
  //   context: GraphQLContext
  // ) => {
  //   return context.prisma.event.findUnique({
  //     where: { id: parent.eventId },
  //   });
  // },

  eloChanges: async (
    parent: Match,
    context: GraphQLContext
  ) => {
    return context.prisma.eloSnapshot.findMany({
      where: {
        versionId: context.eloVersion.id,
        matchId: parent.id,
      }
    });
  },

};

export default match;
