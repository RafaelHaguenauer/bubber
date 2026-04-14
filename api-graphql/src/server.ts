import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import fs from "fs";
import path from "path";
import { resolvers } from "./resolvers";
import { initializeGrpcClients } from "./lib/grpc-client";

async function startServer() {
  try {
    // Inicializar clientes gRPC
    await initializeGrpcClients();
    console.log("✓ Clientes gRPC inicializados");

    const typeDefs = gql(
      fs.readFileSync(
        path.join(__dirname, "schema", "schema.graphql"),
        "utf8"
      )
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const port = process.env.PORT || 4000;
    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(port) },
    });

    console.log(`🚀 Servidor GraphQL rodando em ${url}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
