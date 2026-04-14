import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

let motoristaClient: any = null;
let roteamentoClient: any = null;

const PROTO_PATH_MOTORISTAS = path.join(__dirname, "../../proto/motoristas.proto");
const PROTO_PATH_ROTEAMENTO = path.join(__dirname, "../../proto/roteamento.proto");

export async function initializeGrpcClients() {
  try {
    // Carregar proto motoristas
    const motoristasPackageDef = await protoLoader.load(PROTO_PATH_MOTORISTAS, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const motoristaProto =
      grpc.loadPackageDefinition(motoristasPackageDef).motoristas;

    const motoristasHost = process.env.MOTORISTAS_SERVICE_HOST || "localhost";
    const motoristasPort = process.env.MOTORISTAS_SERVICE_PORT || "50051";

    motoristaClient = new (motoristaProto as any).MotoristaService(
      `${motoristasHost}:${motoristasPort}`,
      grpc.credentials.createInsecure()
    );

    // Carregar proto roteamento
    const roteamentoPackageDef = await protoLoader.load(
      PROTO_PATH_ROTEAMENTO,
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
    );

    const roteamentoProto =
      grpc.loadPackageDefinition(roteamentoPackageDef).roteamento;

    const roteamentoHost = process.env.ROTEAMENTO_SERVICE_HOST || "localhost";
    const roteamentoPort = process.env.ROTEAMENTO_SERVICE_PORT || "50052";

    roteamentoClient = new (roteamentoProto as any).RoteamentoService(
      `${roteamentoHost}:${roteamentoPort}`,
      grpc.credentials.createInsecure()
    );

    console.log("✓ Clientes gRPC carregados com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar clientes gRPC:", error);
    throw error;
  }
}

export function getMotoristaClient() {
  if (!motoristaClient) {
    throw new Error("Cliente gRPC de motoristas não foi inicializado");
  }
  return motoristaClient;
}

export function getRoteamentoClient() {
  if (!roteamentoClient) {
    throw new Error("Cliente gRPC de roteamento não foi inicializado");
  }
  return roteamentoClient;
}

// Util para promisificar chamadas gRPC
export function promisifyGrpc<T = any>(client: any, method: string) {
  return (request: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      client[method](request, (error: any, response: T) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
  };
}
