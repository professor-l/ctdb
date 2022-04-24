import { Playstyle, Result as PrismaResult } from "@prisma/client";
import { GraphQLContext } from "../context";
import { ResultCreator } from "../types";
import DataError from "./DataError";
import Player from "./Player";

// TODO: throw errors when stuff fails :D

export default class Result {

  // wrapped in an optional field to allow dynamic
  // population of the data (outside the constructor)
  // while still requiring certain fields.
  // this helps support, for example, data population
  // from an API call *or* a database query.
  data?: {
    id?: string,
    gameId: string,
    styles?: Playstyle[]
    rank: number,
    score?: number,

    playerId?: string,
  };

  // child object(s)
  player?: Player;

  // whether to include foreign keys as children objects
  // on db reads and whether to cascade on db writes
  cascade: boolean;

  context: GraphQLContext;

  constructor(context: GraphQLContext) {
    this.context = context;

    // no cascade by default
    this.cascade = false;
  }

  readFromPrismaObject(r: PrismaResult) {
    this.data = {
      id: r.id,
      gameId: r.gameId,
      styles: r.styles,
      rank: r.rank,
      score: r.score || undefined,

      playerId: r.playerId,
    };
  }

  async readFromPrisma(id?: string, includeChildren = true) {

    this.cascade = includeChildren;

    if (this.data && this.data.id)
      id = this.data.id;

    if (!id) {
      throw new DataError("No id provided");
    }

    const r = await this.context.prisma.result.findUnique({
      where: { id },
    });

    if (!r)
      throw new DataError("Invalid id provided");

    this.readFromPrismaObject(r);

    // populate child object(s)
    if (this.cascade) {
      this.player = new Player(this.context);
      this.player.readFromPrisma(this.data?.playerId);
    }
  }

  async readFromGQLInput(r: ResultCreator, gameId: string) {

    // GraphQL inputs will always want cascade
    this.cascade = true;

    this.player = new Player(this.context);
    this.player.data = {
      eloName: r.playerName,
      playstyles: r.playstyles,
    };

    this.data = {
      gameId,
      rank: r.rank,
      score: r.score,
      styles: r.playstyles,
    };
  }

  async writeToPrisma() {
    if (!this.data)
      throw new DataError("Data unpopulated");

    if (this.cascade) {
      this.player?.writeToPrisma();
      this.data.playerId = this.player?.data?.id;
    }
    const data = {
      player: {
        connect: { id: this.data.playerId },
      },
      game: {
        connect: { id: this.data.gameId },
      },
      styles: this.data.styles,
      rank: this.data.rank,
      score: this.data.score,
    };

    const r = await this.context.prisma.result.upsert({
      where: { id: this.data.id },
      update: data,
      create: data,
    });

    this.readFromPrismaObject(r);
  }

}