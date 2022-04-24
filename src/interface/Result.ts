import { Playstyle } from "@prisma/client";
import { prisma } from "../context";
import { ResultCreator } from "../types";

// TODO: throw errors when stuff fails :D

export default class Result {

  // wrapped in an optional field to allow dynamic
  // population of the data (outside the constructor)
  // while still requiring certain fields.
  // this helps support, for example, data population
  // from an API call *or* a database query.
  data?: {
    id?: string,
    playerId: string,
    gameId: string,
    styles?: Playstyle[]
    rank: number,
    score?: number,
  };

  async readFromPrisma(id?: string) {

    if (this.data && this.data.id)
      id = this.data.id;

    const r = await prisma.result.findUnique({
      where: { id },
    });

    if (!r)
      return;

    this.data = {
      id,
      playerId: r.playerId,
      gameId: r.gameId,
      styles: r.styles,
      rank: r.rank,
      score: r.score || undefined,
    };
  }

  async readFromGQLInput(r: ResultCreator, gid: string) {

    this.data = {
      gameId: gid,
      rank: r.rank,
      score: r.score,
      styles: r.playstyles,
      // TODO: replace with an upsert formulated as
      // a findOrCreate and give it a proper Player
      playerId: (
        await prisma.player.findUnique({
          where: { eloName: r.playerName }
        })
      )?.id || "",
    };
  }

  async writeToPrisma() {
    if (!this.data)
      return;

    // typically this is a great use case for the
    // prisma API's "upsert" method, but because on
    // paper 

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

    prisma.result.upsert({
      where: { id: this.data.id },
      update: data,
      create: data,
    });
  }

}