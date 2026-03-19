import { MotoristaRepository } from "./MotoristaRepository";
import { Motorista } from "../../types";

export class MotoristaService {
  private repository = new MotoristaRepository();

  async getAllMotoristas(): Promise<Motorista[]> {
    return this.repository.findAll();
  }

  async getMotoristaById(id: number): Promise<Motorista | null> {
    return this.repository.findById(id);
  }

  async createMotorista(data: Partial<Motorista>): Promise<Motorista> {
    return this.repository.create(data);
  }

  async updateMotorista(id: number, data: Partial<Motorista>): Promise<Motorista | null> {
    return this.repository.update(id, data);
  }

  async deleteMotorista(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}