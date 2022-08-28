import { createRepl, create } from "ts-node";

const repl = createRepl();
const service = create({
    ...repl.evalAwarePartialHost
});
repl.setService(service);
repl.start();
repl.evalCode(`
import { GraphQLContext, contextFactory as c } from "./src/context";
let context: GraphQLContext;

console.log("welcome to the ctdb developer repl");
console.log("> if you would like access to a GraphQL context,)
console.log("> please run \`context = await c();\`");
process.stdout.write("> ");
`);
