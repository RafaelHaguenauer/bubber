import { prisma } from "../../lib/prisma";
import { Corrida } from "../../types";

export class CorridaRepository {
  async findAll(): Promise<Corrida[]> {
    return prisma.corrida.findMany();
  }

  async findById(id: number): Promise<Corrida | null> {
    return prisma.corrida.findUnique({ where: { id } });
  }

  async create(input: Partial<Corrida>): Promise<Corrida> {
    return prisma.corrida.create({ data: input as any });
  }

  async update(id: number, input: Partial<Corrida>): Promise<Corrida | null> {
    return prisma.corrida.update({ where: { id }, data: input as any });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.corrida.delete({ where: { id } });
    return true;
  }
}