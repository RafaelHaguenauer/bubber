import { UsuarioResolver } from "../entities/Usuario/UsuarioResolver";
import { MotoristaResolver } from "../entities/Motorista/MotoristaResolver";
import { VeiculoResolver } from "../entities/Veiculo/VeiculoResolver";
import { CorridaResolver } from "../entities/Corrida/CorridaResolver";
import { PagamentoResolver } from "../entities/Pagamento/PagamentoResolver";

export const resolvers = {
  Query: {
    ...UsuarioResolver.Query,
    ...MotoristaResolver.Query,
    ...VeiculoResolver.Query,
    ...CorridaResolver.Query,
    ...PagamentoResolver.Query,
  },
  Mutation: {
    ...UsuarioResolver.Mutation,
    ...MotoristaResolver.Mutation,
    ...VeiculoResolver.Mutation,
    ...CorridaResolver.Mutation,
    ...PagamentoResolver.Mutation,
  },
};