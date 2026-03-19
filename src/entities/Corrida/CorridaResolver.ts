import { CorridaService } from "./CorridaService";

const service = new CorridaService();

export const CorridaResolver = {
  Query: {
    corridas: async () => await service.getAllCorridas(),
    corrida: async (_: any, { id }: { id: number }) =>
      await service.getCorridaById(id),
  },

  Mutation: {
    criarCorrida: async (_: any, args: any) => {
      return await service.createCorrida(args);
    },

    atualizarCorrida: async (_: any, { id, ...dados }: any) => {
      return await service.updateCorrida(id, dados);
    },

    deletarCorrida: async (_: any, { id }: { id: number }) => {
      return await service.deleteCorrida(id);
    },
  },
};