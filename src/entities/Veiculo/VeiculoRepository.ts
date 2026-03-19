import { prisma } from "../../lib/prisma";
import { Veiculo } from "../../types";

export class VeiculoRepository {
  async findAll(): Promise<Veiculo[]> {
    return prisma.veiculo.findMany();
  }

  async findById(id: number): Promise<Veiculo | null> {
    return prisma.veiculo.findUnique({ where: { id } });
  }

  async create(input: Partial<Veiculo>): Promise<Veiculo> {
    return prisma.veiculo.create({ data: input as any });
  }

  async update(id: number, input: Partial<Veiculo>): Promise<Veiculo | null> {
    return prisma.veiculo.update({ where: { id }, data: input as any });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.veiculo.delete({ where: { id } });
    return true;
  }
}