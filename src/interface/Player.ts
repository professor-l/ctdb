import { Playstyle, Pronoun, Player as PrismaPlayer } from "@prisma/client";
import { GraphQLContext } from "../context";

// TODO: throw errors when stuff fails

export default class Player {

  data?: {
    id?: string,
    eloName: string,
    name?: string | null,
    playstyles?: Playstyle[],
    pronouns?: Pronoun[],
    country?: string | null,
  };
  context: GraphQLContext;

  constructor(context: GraphQLContext) {
    this.context = context;
  }

  // self-referential "include" object for prisma queries
  // from parents. simple here but can be more complex in
  // other models, like Event
  static prismaInclude() {
    return { player: true };
  }

  // separate from readFromPrisma to support populating
  // from "parent" objects, like a Result or EloSnapshot
  // this allows parent objects to initialize all children
  // with a single database query
  readFromPrismaObject(p: PrismaPlayer) {
    this.data = {
      id: p.id,
      eloName: p.eloName,
      name: p.name,
      playstyles: p.playstyles,
      pronouns: p.pronouns,
      country: p.country,
    };
  }

  async readFromPrisma(id?: string) {

    if (this.data && this.data.id)
      id = this.data.id;

    if (!id)
      return;
    
    const p = await this.context.prisma.player.findUnique({
      where: { id }
    });

    if (!p)
      return;

    this.readFromPrismaObject(p);
  }

  async readFromGQLInput(data: {
    eloName: string,
    name?: string,
    country?: string,
    playstyles?: Playstyle[],
    pronouns?: Pronoun[]
  }) {

    this.data = data;
  }

  async writeToPrisma() {
    if (!this.data)
      return;

    const p = await this.context.prisma.player.upsert({
      where: { id: this.data.id },
      update: this.data,
      create: this.data,
    });

    this.readFromPrismaObject(p);
    return p;
  }
}