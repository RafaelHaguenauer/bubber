import { gql } from "apollo-server-express";

// SINCERAMENTE NAO SEI O PQ ISSO FUNCIONOU MAS FUNCIONOU E EH ISSO QUE IMPORTA
export const typeDefs = gql`
  type Usuario {
    id: Int!
    nome: String!
    email: String!
    telefone: String!
  }

  type Motorista {
    id: Int!
    nome: String!
    cnh: String!
    telefone: String!
  }

  type Veiculo {
    id: Int!
    modelo: String!
    placa: String!
    cor: String!
  }

  type Corrida {
    id: Int!
    origem: String!
    destino: String!
    valor: Float!
    status: String!
  }

  type Pagamento {
    id: Int!
    forma: String!
    valor: Float!
    status: String!
  }

  type Query {
    usuarios: [Usuario!]!
    usuario(id: Int!): Usuario

    motoristas: [Motorista!]!
    motorista(id: Int!): Motorista

    veiculos: [Veiculo!]!
    veiculo(id: Int!): Veiculo

    corridas: [Corrida!]!
    corrida(id: Int!): Corrida

    pagamentos: [Pagamento!]!
    pagamento(id: Int!): Pagamento
  }

  type Mutation {
    criarUsuario(nome: String!, email: String!, telefone: String!): Usuario!
    atualizarUsuario(id: Int!, nome: String!, email: String!, telefone: String!): Usuario!
    deletarUsuario(id: Int!): Boolean!

    criarMotorista(nome: String!, cnh: String!, telefone: String!): Motorista!
    atualizarMotorista(id: Int!, nome: String!, cnh: String!, telefone: String!): Motorista!
    deletarMotorista(id: Int!): Boolean!

    criarVeiculo(modelo: String!, placa: String!, cor: String!): Veiculo!
    atualizarVeiculo(id: Int!, modelo: String!, placa: String!, cor: String!): Veiculo!
    deletarVeiculo(id: Int!): Boolean!

    criarCorrida(origem: String!, destino: String!, valor: Float!, status: String!): Corrida!
    atualizarCorrida(id: Int!, origem: String!, destino: String!, valor: Float!, status: String!): Corrida!
    deletarCorrida(id: Int!): Boolean!

    criarPagamento(forma: String!, valor: Float!, status: String!): Pagamento!
    atualizarPagamento(id: Int!, forma: String!, valor: Float!, status: String!): Pagamento!
    deletarPagamento(id: Int!): Boolean!
  }
`;