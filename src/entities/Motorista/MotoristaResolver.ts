import { MotoristaService } from "./MotoristaService";

const service = new MotoristaService();

export const MotoristaResolver = {
  Query: {
    motoristas: async () => await service.getAllMotoristas(),
    motorista: async (_: any, { id }: { id: number }) =>
      await service.getMotoristaById(id),
  },

  Mutation: {
    criarMotorista: async (_: any, args: any) => {
      return await service.createMotorista(args);
    },

    atualizarMotorista: async (_: any, { id, ...dados }: any) => {
      return await service.updateMotorista(id, dados);
    },

    deletarMotorista: async (_: any, { id }: { id: number }) => {
      return await service.deleteMotorista(id);
    },
  },
};