import { prisma } from "../lib/prisma";
import {
  getMotoristaClient,
  getRoteamentoClient,
  promisifyGrpc,
} from "../lib/grpc-client";

export const resolvers = {
  Query: {
    // ===== USUARIOS =====
    usuarios: async () => {
      return await prisma.usuario.findMany({
        include: {
          corridas: true,
          pagamentos: true,
        },
      });
    },

    usuario: async (_: any, { id }: { id: number }) => {
      return await prisma.usuario.findUnique({
        where: { id },
        include: {
          corridas: true,
          pagamentos: true,
        },
      });
    },

    // ===== MOTORISTAS =====
    motoristas: async () => {
      return await prisma.motorista.findMany({
        include: {
          veiculo: true,
          corridas: true,
        },
      });
    },

    motorista: async (_: any, { id }: { id: number }) => {
      return await prisma.motorista.findUnique({
        where: { id },
        include: {
          veiculo: true,
          corridas: true,
        },
      });
    },

    // Chamar microsserviço de motoristas para encontrar próximos
    motoristasProximos: async (
      _: any,
      {
        latitude,
        longitude,
        raioKm = 5,
      }: { latitude: number; longitude: number; raioKm?: number }
    ) => {
      try {
        const client = getMotoristaClient();
        const findersEncertar =promisifyGrpc(client, "encontrarMotoristasProximos");

        const response = await findersEncertar({
          latitude,
          longitude,
          raio_km: raioKm,
        });

        // Buscar dados completos do motorista no banco
        const motoristasCompletos = await Promise.all(
          response.motoristas.map(async (m: any) => {
            const motorista = await prisma.motorista.findUnique({
              where: { id: m.motorista_id },
              include: { veiculo: true },
            });
            return {
              motorista,
              distancia: m.distancia,
              tempo: m.tempo_minutos,
            };
          })
        );

        return motoristasCompletos;
      } catch (error) {
        console.error("Erro ao buscar motoristas próximos:", error);
        throw new Error("Falha ao buscar motoristas próximos");
      }
    },

    // ===== VEICULOS =====
    veiculos: async () => {
      return await prisma.veiculo.findMany({
        include: {
          motoristas: true,
        },
      });
    },

    veiculo: async (_: any, { id }: { id: number }) => {
      return await prisma.veiculo.findUnique({
        where: { id },
        include: {
          motoristas: true,
        },
      });
    },

    // ===== CORRIDAS =====
    corridas: async () => {
      return await prisma.corrida.findMany({
        include: {
          motorista: true,
          usuario: true,
          veiculo: true,
          pagamento: true,
        },
      });
    },

    corrida: async (_: any, { id }: { id: number }) => {
      return await prisma.corrida.findUnique({
        where: { id },
        include: {
          motorista: true,
          usuario: true,
          veiculo: true,
          pagamento: true,
        },
      });
    },

    // Calcular rota usando microsserviço de roteamento
    calcularRota: async (
      _: any,
      {
        origemLat,
        origemLon,
        destinoLat,
        destinoLon,
      }: {
        origemLat: number;
        origemLon: number;
        destinoLat: number;
        destinoLon: number;
      }
    ) => {
      try {
        const client = getRoteamentoClient();
        const calcularRotaFn = promisifyGrpc(client, "calcularRota");

        const response = await calcularRotaFn({
          origem_lat: origemLat,
          origem_lon: origemLon,
          destino_lat: destinoLat,
          destino_lon: destinoLon,
        });

        return {
          distancia: response.distancia_metros,
          duracao: response.duracao_segundos,
          distanciaEmKm: response.distancia_metros / 1000,
          duracaoEmMinutos: Math.ceil(response.duracao_segundos / 60),
        };
      } catch (error) {
        console.error("Erro ao calcular rota:", error);
        throw new Error("Falha ao calcular rota");
      }
    },

    // ===== PAGAMENTOS =====
    pagamentos: async () => {
      return await prisma.pagamento.findMany({
        include: {
          corrida: true,
        },
      });
    },

    pagamento: async (_: any, { id }: { id: number }) => {
      return await prisma.pagamento.findUnique({
        where: { id },
        include: {
          corrida: true,
        },
      });
    },
  },

  Mutation: {
    // ===== USUARIOS =====
    criarUsuario: async (
      _: any,
      { nome, email, telefone }: { nome: string; email: string; telefone: string }
    ) => {
      return await prisma.usuario.create({
        data: { nome, email, telefone },
        include: {
          corridas: true,
          pagamentos: true,
        },
      });
    },

    atualizarUsuario: async (
      _: any,
      { id, nome, email, telefone }: any
    ) => {
      return await prisma.usuario.update({
        where: { id },
        data: {
          ...(nome && { nome }),
          ...(email && { email }),
          ...(telefone && { telefone }),
        },
        include: {
          corridas: true,
          pagamentos: true,
        },
      });
    },

    atualizarLocalizacaoUsuario: async (
      _: any,
      { id, latitude, longitude }: { id: number; latitude: number; longitude: number }
    ) => {
      return await prisma.usuario.update({
        where: { id },
        data: { latitude, longitude },
        include: {
          corridas: true,
          pagamentos: true,
        },
      });
    },

    deletarUsuario: async (_: any, { id }: { id: number }) => {
      await prisma.usuario.delete({ where: { id } });
      return true;
    },

    // ===== MOTORISTAS =====
    criarMotorista: async (
      _: any,
      { nome, cnh, telefone }: { nome: string; cnh: string; telefone: string }
    ) => {
      return await prisma.motorista.create({
        data: { nome, cnh, telefone },
        include: { veiculo: true, corridas: true },
      });
    },

    atualizarMotorista: async (
      _: any,
      { id, nome, cnh, telefone }: any
    ) => {
      return await prisma.motorista.update({
        where: { id },
        data: {
          ...(nome && { nome }),
          ...(cnh && { cnh }),
          ...(telefone && { telefone }),
        },
        include: { veiculo: true, corridas: true },
      });
    },

    atualizarLocalizacaoMotorista: async (
      _: any,
      { id, latitude, longitude }: { id: number; latitude: number; longitude: number }
    ) => {
      try {
        // Atualizar no banco local
        const motorista = await prisma.motorista.update({
          where: { id },
          data: { latitude, longitude },
          include: { veiculo: true, corridas: true },
        });

        // Também notificar o microsserviço de motoristas
        try {
          const client = getMotoristaClient();
          const atualizarFn = promisifyGrpc(client, "atualizarLocalizacao");
          await atualizarFn({
            motorista_id: id,
            latitude,
            longitude,
          });
        } catch (grpcError) {
          console.warn("Aviso: falha ao atualizar localização no microsserviço:", grpcError);
          // Não falhar completamente se o microsserviço estiver indisponível
        }

        return motorista;
      } catch (error) {
        console.error("Erro ao atualizar localização do motorista:", error);
        throw error;
      }
    },

    atualizarDisponibilidade: async (
      _: any,
      { id, disponivel }: { id: number; disponivel: boolean }
    ) => {
      return await prisma.motorista.update({
        where: { id },
        data: { disponivel },
        include: { veiculo: true, corridas: true },
      });
    },

    deletarMotorista: async (_: any, { id }: { id: number }) => {
      await prisma.motorista.delete({ where: { id } });
      return true;
    },

    // ===== VEICULOS =====
    criarVeiculo: async (
      _: any,
      {
        modelo,
        placa,
        cor,
        renavam,
      }: { modelo: string; placa: string; cor: string; renavam?: string }
    ) => {
      return await prisma.veiculo.create({
        data: { modelo, placa, cor, ...(renavam && { renavam }) },
        include: { motoristas: true },
      });
    },

    atualizarVeiculo: async (
      _: any,
      { id, modelo, placa, cor }: any
    ) => {
      return await prisma.veiculo.update({
        where: { id },
        data: {
          ...(modelo && { modelo }),
          ...(placa && { placa }),
          ...(cor && { cor }),
        },
        include: { motoristas: true },
      });
    },

    deletarVeiculo: async (_: any, { id }: { id: number }) => {
      await prisma.veiculo.delete({ where: { id } });
      return true;
    },

    // ===== CORRIDAS =====
    criarCorrida: async (
      _: any,
      {
        usuarioId,
        origemLat,
        origemLon,
        destinoLat,
        destinoLon,
      }: {
        usuarioId: number;
        origemLat: number;
        origemLon: number;
        destinoLat: number;
        destinoLon: number;
      }
    ) => {
      // Calcular rota automaticamente
      let distancia = 0;
      let duracao = 0;

      try {
        const client = getRoteamentoClient();
        const calcularRotaFn = promisifyGrpc(client, "calcularRota");

        const rotaResponse = await calcularRotaFn({
          origem_lat: origemLat,
          origem_lon: origemLon,
          destino_lat: destinoLat,
          destino_lon: destinoLon,
        });

        distancia = rotaResponse.distancia_metros / 1000; // converter para km
        duracao = Math.ceil(rotaResponse.duracao_segundos / 60); // converter para minutos
      } catch (error) {
        console.warn("Aviso: não foi possível calcular a rota:", error);
      }

      // Calcular valor da corrida (exemplo: R$ 2,50 por km + R$ 5,00 base)
      const valor = 5.0 + distancia * 2.5;

      return await prisma.corrida.create({
        data: {
          usuarioId,
          origemLat,
          origemLon,
          destinoLat,
          destinoLon,
          valor: new Decimal(valor),
          distancia,
          duracao,
          status: "pendente",
        },
        include: {
          motorista: true,
          usuario: true,
          veiculo: true,
          pagamento: true,
        },
      });
    },

    selecionarMotoristaParaCorrida: async (
      _: any,
      { corridaId, motoristaId }: { corridaId: number; motoristaId: number }
    ) => {
      const corrida = await prisma.corrida.update({
        where: { id: corridaId },
        data: {
          motoristaId,
          status: "confirmada",
        },
        include: {
          motorista: true,
          usuario: true,
          veiculo: { include: { motoristas: true } },
          pagamento: true,
        },
      });

      // Atualizar disponibilidade do motorista
      await prisma.motorista.update({
        where: { id: motoristaId },
        data: { disponivel: false },
      });

      return corrida;
    },

    atualizarCorrida: async (
      _: any,
      { id, status, valor }: any
    ) => {
      return await prisma.corrida.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(valor && { valor: new Decimal(valor) }),
        },
        include: {
          motorista: true,
          usuario: true,
          veiculo: true,
          pagamento: true,
        },
      });
    },

    deletarCorrida: async (_: any, { id }: { id: number }) => {
      await prisma.corrida.delete({ where: { id } });
      return true;
    },

    // ===== PAGAMENTOS =====
    criarPagamento: async (
      _: any,
      {
        corridaId,
        forma,
        valor,
      }: { corridaId: number; forma: string; valor: number }
    ) => {
      return await prisma.pagamento.create({
        data: {
          corridaId,
          forma,
          valor: new Decimal(valor),
          status: "pendente",
        },
        include: { corrida: true },
      });
    },

    atualizarPagamento: async (
      _: any,
      { id, status }: any
    ) => {
      return await prisma.pagamento.update({
        where: { id },
        data: {
          ...(status && { status }),
        },
        include: { corrida: true },
      });
    },

    deletarPagamento: async (_: any, { id }: { id: number }) => {
      await prisma.pagamento.delete({ where: { id } });
      return true;
    },
  },
};

// Importar Decimal do Prisma
import { Decimal } from "@prisma/client/runtime/library";
