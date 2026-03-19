import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'

config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })

const prisma = new PrismaClient({ adapter })

async function main() {
  // usuarios
  const usuario1 = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '11999999999'
    }
  })

  const usuario2 = await prisma.usuario.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria@example.com',
      telefone: '11888888888'
    }
  })

  // motoristas
  const motorista1 = await prisma.motorista.create({
    data: {
      nome: 'Carlos Oliveira',
      cnh: '123456789',
      telefone: '11777777777'
    }
  })

  const motorista2 = await prisma.motorista.create({
    data: {
      nome: 'Ana Pereira',
      cnh: '987654321',
      telefone: '11666666666'
    }
  })

  // veiculos
  const veiculo1 = await prisma.veiculo.create({
    data: {
      modelo: 'Toyota Corolla',
      placa: 'ABC1234',
      cor: 'Prata'
    }
  })

  const veiculo2 = await prisma.veiculo.create({
    data: {
      modelo: 'Honda Civic',
      placa: 'DEF5678',
      cor: 'Preto'
    }
  })

  // corridas
  const corrida1 = await prisma.corrida.create({
    data: {
      origem: 'Rua A, 123',
      destino: 'Rua B, 456',
      valor: 25.50,
      status: 'Concluída',
      motoristaId: motorista1.id,
      usuarioId: usuario1.id,
      veiculoId: veiculo1.id
    }
  })

  const corrida2 = await prisma.corrida.create({
    data: {
      origem: 'Avenida C, 789',
      destino: 'Praça D, 101',
      valor: 30.00,
      status: 'Em andamento',
      motoristaId: motorista2.id,
      usuarioId: usuario2.id,
      veiculoId: veiculo2.id
    }
  })

  // pagamentos
  await prisma.pagamento.create({
    data: {
      forma: 'Cartão de Crédito',
      valor: 25.50,
      status: 'Aprovado',
      usuarioId: usuario1.id,
      corridaId: corrida1.id
    }
  })

  await prisma.pagamento.create({
    data: {
      forma: 'Dinheiro',
      valor: 30.00,
      status: 'Pendente',
      usuarioId: usuario2.id,
      corridaId: corrida2.id
    }
  })

  console.log('Seed Criaad!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })