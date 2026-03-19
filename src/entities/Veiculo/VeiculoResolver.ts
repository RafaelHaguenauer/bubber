import { VeiculoService } from "./VeiculoService";

const service = new VeiculoService();

export const VeiculoResolver = {
  Query: {
    veiculos: async () => await service.getAllVeiculos(),
    veiculo: async (_: any, { id }: { id: number }) =>
      await service.getVeiculoById(id),
  },

  Mutation: {
    criarVeiculo: async (_: any, args: any) => {
      return await service.createVeiculo(args);
    },

    atualizarVeiculo: async (_: any, { id, ...dados }: any) => {
      return await service.updateVeiculo(id, dados);
    },

    deletarVeiculo: async (_: any, { id }: { id: number }) => {
      return await service.deleteVeiculo(id);
    },
  },
};