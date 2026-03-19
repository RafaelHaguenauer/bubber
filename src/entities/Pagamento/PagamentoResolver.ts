import { PagamentoService } from "./PagamentoService";

const service = new PagamentoService();

export const PagamentoResolver = {
  Query: {
    pagamentos: async () => await service.getAllPagamentos(),
    pagamento: async (_: any, { id }: { id: number }) =>
      await service.getPagamentoById(id),
  },

  Mutation: {
    criarPagamento: async (_: any, args: any) => {
      return await service.createPagamento(args);
    },

    atualizarPagamento: async (_: any, { id, ...dados }: any) => {
      return await service.updatePagamento(id, dados);
    },

    deletarPagamento: async (_: any, { id }: { id: number }) => {
      return await service.deletePagamento(id);
    },
  },
};