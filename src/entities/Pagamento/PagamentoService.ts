import { PagamentoRepository } from "./PagamentoRepository";
import { Pagamento } from "../../types";

export class PagamentoService {
  private repository = new PagamentoRepository();

  async getAllPagamentos(): Promise<Pagamento[]> {
    return this.repository.findAll();
  }

  async getPagamentoById(id: number): Promise<Pagamento | null> {
    return this.repository.findById(id);
  }

  async createPagamento(data: Partial<Pagamento>): Promise<Pagamento> {
    return this.repository.create(data);
  }

  async updatePagamento(id: number, data: Partial<Pagamento>): Promise<Pagamento | null> {
    return this.repository.update(id, data);
  }

  async deletePagamento(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}