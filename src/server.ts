import express from "express";
import { ApolloServer } from "apollo-server-express";
import { AppDataSource } from "./data-source";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";

async function startServer() {
  await AppDataSource.initialize();

  const app: express.Application = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000/graphql");
  });
} 
// fiz o express chamar o graphql igual a gente viu em sala

startServer();