import { GraphQLContext } from "../context";
import Result from "../interface/Result";
import { ResultCreator } from "../types";

const createResult = async (
  parent: unknown,
  args: {
    gameId: string,
    result: ResultCreator,
  },
  context: GraphQLContext
) => {

  const r = new Result(context);

  await r.readFromGQLInput(args.result, args.gameId);
  return r.writeToPrisma();

};

export default createResult;