export type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  corridas?: Corrida[];
  pagamentos?: Pagamento[];
};

export type Motorista = {
  id: number;
  nome: string;
  cnh: string;
  telefone: string;
  corridas?: Corrida[];
};

export type Veiculo = {
  id: number;
  modelo: string;
  placa: string;
  cor: string;
  corridas?: Corrida[];
};

export type Corrida = {
  id: number;
  origem: string;
  destino: string;
  valor: any; // Decimal
  status: string;
  motoristaId: number;
  usuarioId: number;
  veiculoId: number;
  motorista?: Motorista;
  usuario?: Usuario;
  veiculo?: Veiculo;
  pagamento?: Pagamento;
};

export type Pagamento = {
  id: number;
  forma: string;
  valor: any; // Decimal
  status: string;
  usuarioId: number;
  corridaId: number;
  usuario?: Usuario;
  corrida?: Corrida;
};