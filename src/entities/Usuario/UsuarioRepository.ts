import { prisma } from "../../lib/prisma";
import { Usuario } from "../../types";

export class UsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    return prisma.usuario.findMany();
  }

  async findById(id: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async create(input: Partial<Usuario>): Promise<Usuario> {
    return prisma.usuario.create({ data: input as any });
  }

  async update(id: number, input: Partial<Usuario>): Promise<Usuario | null> {
    return prisma.usuario.update({ where: { id }, data: input as any });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.usuario.delete({ where: { id } });
    return true;
  }
}