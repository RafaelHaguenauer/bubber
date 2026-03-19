import { UsuarioRepository } from "./UsuarioRepository";
import { Usuario } from "../../types";

export class UsuarioService {
  private repository = new UsuarioRepository();

  async getAllUsuarios(): Promise<Usuario[]> {
    return this.repository.findAll();
  }

  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.repository.findById(id);
  }

  async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
    return this.repository.create(data);
  }

  async updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    return this.repository.update(id, data);
  }

  async deleteUsuario(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}