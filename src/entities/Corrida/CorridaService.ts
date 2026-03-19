import { CorridaRepository } from "./CorridaRepository";
import { Corrida } from "../../types";

export class CorridaService {
  private repository = new CorridaRepository();

  async getAllCorridas(): Promise<Corrida[]> {
    return this.repository.findAll();
  }

  async getCorridaById(id: number): Promise<Corrida | null> {
    return this.repository.findById(id);
  }

  async createCorrida(data: Partial<Corrida>): Promise<Corrida> {
    return this.repository.create(data);
  }

  async updateCorrida(id: number, data: Partial<Corrida>): Promise<Corrida | null> {
    return this.repository.update(id, data);
  }

  async deleteCorrida(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}