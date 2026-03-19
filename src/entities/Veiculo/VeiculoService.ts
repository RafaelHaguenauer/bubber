import { VeiculoRepository } from "./VeiculoRepository";
import { Veiculo } from "../../types";

export class VeiculoService {
  private repository = new VeiculoRepository();

  async getAllVeiculos(): Promise<Veiculo[]> {
    return this.repository.findAll();
  }

  async getVeiculoById(id: number): Promise<Veiculo | null> {
    return this.repository.findById(id);
  }

  async createVeiculo(data: Partial<Veiculo>): Promise<Veiculo> {
    return this.repository.create(data);
  }

  async updateVeiculo(id: number, data: Partial<Veiculo>): Promise<Veiculo | null> {
    return this.repository.update(id, data);
  }

  async deleteVeiculo(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}