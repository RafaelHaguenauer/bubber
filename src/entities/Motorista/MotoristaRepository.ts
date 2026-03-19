import { prisma } from "../../lib/prisma";
import { Motorista } from "../../types";

export class MotoristaRepository {
  async findAll(): Promise<Motorista[]> {
    return prisma.motorista.findMany();
  }

  async findById(id: number): Promise<Motorista | null> {
    return prisma.motorista.findUnique({ where: { id } });
  }

  async create(input: Partial<Motorista>): Promise<Motorista> {
    return prisma.motorista.create({ data: input as any });
  }

  async update(id: number, input: Partial<Motorista>): Promise<Motorista | null> {
    return prisma.motorista.update({ where: { id }, data: input as any });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.motorista.delete({ where: { id } });
    return true;
  }
}