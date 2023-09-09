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

    // only check for passphrase if .env file has a nonempty value
    if (process.env.PASSPHRASE && process.env.PASSPHRASE != "") {
      if ("passphrase" in request.headers) {
        const passphrase = request.headers["passphrase"];
        // if passphrase is incorrect, send error
        // TODO: check that the env exists before starting server?
        if (passphrase !== process.env.PASSPHRASE) {
          reply.status(400).send({
              "errors": [
                {
                  "message": "incorrect passphrase"
                }
              ]
            });
          return;
        }
      }
      else {
        // send error indicating that passphrase is needed
        reply.status(400).send({
            "errors": [
              {
                "message": "must provide passphrase header"
              }
            ]
          });
        return;
      }
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
  // quick fix to make docker configuration work
  // see https://www.fastify.io/docs/latest/Reference/Server/#listen
  server.listen({ port: 3000, host: '0.0.0.0' }, () => {
    console.log(`Server is running on http://localhost:3000/`);
  });
}

main();
