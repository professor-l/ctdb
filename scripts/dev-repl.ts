import { createRepl, create } from "ts-node";

const repl = createRepl();
const service = create({
    ...repl.evalAwarePartialHost
});
repl.setService(service);
repl.start();
repl.evalCode(`
import { GraphQLContext, contextFactory as c } from "./src/context";
import {
    pullMatch,
    pullComputedElo,
    pullManyMatch,
    pullManyComputedElo
} from "./src/elo/dbInterface";

let context: GraphQLContext;

console.log("welcome to the ctdb developer repl! available functions:");
console.log("> pullMatch, pullComputedElo, their pullMany counterparts")
console.log("> if you would like access to a GraphQL context,")
console.log("> please run \`context = await c();\`");
process.stdout.write("> ");
`);
