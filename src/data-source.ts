import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entity/Usuario";
import { Motorista } from "./entity/Motorista";
import { Veiculo } from "./entity/Veiculo";
import { Corrida } from "./entity/Corrida";
import { Pagamento } from "./entity/Pagamento";

// conexao banoc

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "bubber",
  synchronize: true,
  logging: false,
  entities: [Usuario, Motorista, Veiculo, Corrida, Pagamento]
});