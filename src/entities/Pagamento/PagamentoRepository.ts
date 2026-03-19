import { prisma } from "../../lib/prisma";
import { Pagamento } from "../../types";

export class PagamentoRepository {
  async findAll(): Promise<Pagamento[]> {
    return prisma.pagamento.findMany();
  }

  async findById(id: number): Promise<Pagamento | null> {
    return prisma.pagamento.findUnique({ where: { id } });
  }

  async create(input: Partial<Pagamento>): Promise<Pagamento> {
    return prisma.pagamento.create({ data: input as any });
  }

  async update(id: number, input: Partial<Pagamento>): Promise<Pagamento | null> {
    return prisma.pagamento.update({ where: { id }, data: input as any });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.pagamento.delete({ where: { id } });
    return true;
  }
}