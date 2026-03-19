import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import fs from "fs";
import path from "path";
import { resolvers } from "./resolvers";

async function startServer() {
  const typeDefs = gql(fs.readFileSync(path.join(__dirname, "schema", "schema.graphql"), "utf8"));

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  });

  console.log(`Servidor GraphQL rodando em ${url}`);
}

startServer();