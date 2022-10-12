import "graphql-import-node";
import fastify, { FastifyInstance } from "fastify";

import {
  getGraphQLParameters,
  processRequest,
  Request,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendResult
} from "graphql-helix";

import { schema } from "./schema";
import { contextFactory } from "./context";

export const server: FastifyInstance = fastify();

server.route({
  method: ["POST", "GET"],
  url: "/graphql",
  handler: async (req, reply) => {
    const request: Request = {
      headers: req.headers,
      method: req.method,
      query: req.query,
      body: req.body,
    };

    if (shouldRenderGraphiQL(request)) {
      reply.header("Content-Type", "text/html");
      reply.send(
        renderGraphiQL({
          endpoint: "/graphql",
        })
      );

      return;
    }
  
    const { operationName, query, variables } = getGraphQLParameters(request);
  
    const result = await processRequest({
      request,
      schema,
      operationName,
      contextFactory,
      query,
      variables,
    });
  
    sendResult(result, reply.raw);
  }
});


async function main() {    
  server.listen({port: 3000 }, () => {
    console.log(`Server is running on http://localhost:3000/`);
  });
}

main();
