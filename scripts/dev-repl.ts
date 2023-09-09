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
    pullMatches,
    pullComputedElos,
} from "./src/elo/util/dbInterface";
import { eloPipeline } from "./src/elo/pipeline";

const testElo = async (
    context: GraphQLContext
) => {
    let matches = await context.prisma.match.findMany({
        orderBy: { timestamp: "asc" }
    });

    let results = await eloPipeline(matches[0].id, context);
};

let match, c1, c2;

const populate = async (
    context: GraphQLContext
) => {
    match = await context.prisma.match.findUnique({
        where: { id: "cl8mdpvwk0154hzfem8r15cdi" }
    });
    [c1, c2] = await context.prisma.computedElo.findMany({
        where: { id: { in: ["cl8mf7lyn0023zmfeb33jir3p", "cl8mf7lyn0022zmfemr2mqcat"] } }
    });
}

console.log("welcome to the ctdb developer repl! available functions:");
console.log(">     pullMatches, pullComputedElos, eloPipeline")
console.log("> if you would like access to a GraphQL context,")
console.log("> please run \`let context = await c();\`");
process.stdout.write("> ");
`);
