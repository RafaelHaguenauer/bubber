import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";
import { Motorista } from "../entity/Motorista";
import { Veiculo } from "../entity/Veiculo";
import { Corrida } from "../entity/Corrida";
import { Pagamento } from "../entity/Pagamento";

// não tenho service nem uma camada de repository... Não ia dar tempo de fazer direitinho

export const resolvers = {
  Query: {
    usuarios: async () => await AppDataSource.getRepository(Usuario).find(),
    usuario: async (_: any, { id }: { id: number }) =>
      await AppDataSource.getRepository(Usuario).findOneBy({ id }),

    motoristas: async () => await AppDataSource.getRepository(Motorista).find(),
    motorista: async (_: any, { id }: { id: number }) =>
      await AppDataSource.getRepository(Motorista).findOneBy({ id }),

    veiculos: async () => await AppDataSource.getRepository(Veiculo).find(),
    veiculo: async (_: any, { id }: { id: number }) =>
      await AppDataSource.getRepository(Veiculo).findOneBy({ id }),

    corridas: async () => await AppDataSource.getRepository(Corrida).find(),
    corrida: async (_: any, { id }: { id: number }) =>
      await AppDataSource.getRepository(Corrida).findOneBy({ id }),

    pagamentos: async () => await AppDataSource.getRepository(Pagamento).find(),
    pagamento: async (_: any, { id }: { id: number }) =>
      await AppDataSource.getRepository(Pagamento).findOneBy({ id }),
  },

  Mutation: {
    criarUsuario: async (_: any, args: any) => {
      const repo = AppDataSource.getRepository(Usuario);
      const usuario = repo.create(args);
      return await repo.save(usuario);
    },

    atualizarUsuario: async (_: any, { id, ...dados }: any) => {
      const repo = AppDataSource.getRepository(Usuario);
      await repo.update(id, dados);
      return await repo.findOneBy({ id });
    },

    deletarUsuario: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Usuario);
      await repo.delete(id);
      return true;
    },

    criarMotorista: async (_: any, args: any) => {
      const repo = AppDataSource.getRepository(Motorista);
      const motorista = repo.create(args);
      return await repo.save(motorista);
    },

    atualizarMotorista: async (_: any, { id, ...dados }: any) => {
      const repo = AppDataSource.getRepository(Motorista);
      await repo.update(id, dados);
      return await repo.findOneBy({ id });
    },

    deletarMotorista: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Motorista);
      await repo.delete(id);
      return true;
    },

    criarVeiculo: async (_: any, args: any) => {
      const repo = AppDataSource.getRepository(Veiculo);
      const veiculo = repo.create(args);
      return await repo.save(veiculo);
    },

    atualizarVeiculo: async (_: any, { id, ...dados }: any) => {
      const repo = AppDataSource.getRepository(Veiculo);
      await repo.update(id, dados);
      return await repo.findOneBy({ id });
    },

    deletarVeiculo: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Veiculo);
      await repo.delete(id);
      return true;
    },

    criarCorrida: async (_: any, args: any) => {
      const repo = AppDataSource.getRepository(Corrida);
      const corrida = repo.create(args);
      return await repo.save(corrida);
    },

    atualizarCorrida: async (_: any, { id, ...dados }: any) => {
      const repo = AppDataSource.getRepository(Corrida);
      await repo.update(id, dados);
      return await repo.findOneBy({ id });
    },

    deletarCorrida: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Corrida);
      await repo.delete(id);
      return true;
    },

    criarPagamento: async (_: any, args: any) => {
      const repo = AppDataSource.getRepository(Pagamento);
      const pagamento = repo.create(args);
      return await repo.save(pagamento);
    },

    atualizarPagamento: async (_: any, { id, ...dados }: any) => {
      const repo = AppDataSource.getRepository(Pagamento);
      await repo.update(id, dados);
      return await repo.findOneBy({ id });
    },

    deletarPagamento: async (_: any, { id }: { id: number }) => {
      const repo = AppDataSource.getRepository(Pagamento);
      await repo.delete(id);
      return true;
    }
  }
};