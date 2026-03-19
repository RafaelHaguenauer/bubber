import { UsuarioService } from "./UsuarioService";

const service = new UsuarioService();

export const UsuarioResolver = {
  Query: {
    usuarios: async () => await service.getAllUsuarios(),
    usuario: async (_: any, { id }: { id: number }) =>
      await service.getUsuarioById(id),
  },

  Mutation: {
    criarUsuario: async (_: any, args: any) => {
      return await service.createUsuario(args);
    },

    atualizarUsuario: async (_: any, { id, ...dados }: any) => {
      return await service.updateUsuario(id, dados);
    },

    deletarUsuario: async (_: any, { id }: { id: number }) => {
      return await service.deleteUsuario(id);
    },
  },
};