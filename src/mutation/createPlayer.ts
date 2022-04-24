import { GraphQLContext } from "../context";
import Player from "../interface/Player";
import { Playstyle, Pronoun } from "../types";

const createPlayer = async (
  parent: unknown,
  args: {
    eloName: string,
    name?: string,
    country?: string,
    playstyles?: Playstyle[],
    pronouns?: Pronoun[],
  },
  context: GraphQLContext,
) => {

  const p = new Player(context);
  p.readFromGQLInput(args);
  return p.writeToPrisma();

};

export default createPlayer;