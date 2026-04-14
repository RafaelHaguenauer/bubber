# 🚗 Bubber - Sistema de Ridesharing com Microsserviços

Sistema distribuído de ridesharing implementado com microsserviços, gRPC e integração com OpenStreetMap.

## 📋 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    API GraphQL (Node.js)                    │
│              - Orquestração de negócio                       │
│              - Comunicação com clientes                      │
└────────────┬──────────────────┬──────────────────────────────┘
             │                  │
             │ gRPC             │ gRPC
             ▼                  ▼
    ┌──────────────────┐  ┌──────────────────┐
    │ Microserviço de  │  │ Microserviço de  │
    │    Motoristas    │  │    Roteamento    │
    │    (Python)      │  │     (Python)     │
    │   + FastAPI      │  │  + OSRM          │
    └────────┬─────────┘  └──────┬───────────┘
             │                   │
             │                   │
             ▼                   ▼
    ┌─────────────────────────────────────┐
    │     PostgreSQL (Banco de Dados)     │
    └─────────────────────────────────────┘
```

## 🏗️ Componentes

### 1. **API GraphQL** (Node.js + TypeScript)
- Servidor Apollo Server
- ORM Prisma com PostgreSQL
- Integração com microsserviços via gRPC
- Resolvers para criar/gerenciar corridas

### 2. **Microsserviço de Motoristas** (Python + FastAPI)
- Cadastro e atualização de motoristas
- Busca de motoristas próximos usando Haversine
- Controle de disponibilidade
- Integração com PostgreSQL

### 3. **Microsserviço de Roteamento** (Python + FastAPI)
- Integração com OSRM (OpenStreetMap Routing Machine)
- Cálculo de rotas e distâncias
- Otimização de rotas com múltiplas paradas
- Retorno de instruções turn-by-turn

### 4. **Banco de Dados** (PostgreSQL)
- Tabelas para Usuários, Motoristas, Veículos, Corridas e Pagamentos
- Migrations automáticas com Prisma

### 5. **OSRM** (Docker)
- Servidor de roteamento baseado em OpenStreetMap
- Cálculo eficiente de rotas

## 🚀 Como Iniciar

### Pré-requisitos
- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)
- Git

### Variáveis de Ambiente

Copie `.env` para cada serviço:

```bash
cd api-graphql && cp .env.example .env
cd service-motoristas && cp .env.example .env
cd service-roteamento && cp .env.example .env
```

### Iniciando com Docker Compose

```bash
# Sem OSRM (para testes sem roteamento real)
docker-compose up -d

# Com OSRM (requer dados do OSM - ~400MB para Brasil)
docker-compose --profile osrm up -d
```

### Verificar Status

```bash
# Listar containers
docker-compose ps

# Ver logs da API GraphQL
docker-compose logs -f api-graphql

# Ver logs dos microsserviços
docker-compose logs -f service-motoristas
docker-compose logs -f service-roteamento
```

## 📝 Exemplos de Uso

### 1. Criar um Usuário

```graphql
mutation {
  criarUsuario(
    nome: "João Silva"
    email: "joao@email.com"
    telefone: "11999999999"
  ) {
    id
    nome
    email
  }
}
```

### 2. Criar um Motorista

```graphql
mutation {
  criarMotorista(
    nome: "Pedro Costa"
    cnh: "12345678901"
    telefone: "11988888888"
  ) {
    id
    nome
    disponivel
  }
}
```

### 3. Atualizar Localização do Motorista

```graphql
mutation {
  atualizarLocalizacaoMotorista(
    id: 1
    latitude: -23.5505
    longitude: -46.6333
  ) {
    id
    latitude
    longitude
  }
}
```

### 4. Buscar Motoristas Próximos

```graphql
query {
  motoristasPróximos(
    latitude: -23.5505
    longitude: -46.6333
    raioKm: 5
  ) {
    motorista {
      id
      nome
      telefone
    }
    distancia
    tempo
  }
}
```

### 5. Calcular Rota

```graphql
query {
  calcularRota(
    origemLat: -23.5505
    origemLon: -46.6333
    destinoLat: -23.5890
    destinoLon: -46.6760
  ) {
    distanciaEmKm
    duracaoEmMinutos
    distancia
    duracao
  }
}
```

### 6. Criar Corrida

```graphql
mutation {
  criarCorrida(
    usuarioId: 1
    origemLat: -23.5505
    origemLon: -46.6333
    destinoLat: -23.5890
    destinoLon: -46.6760
  ) {
    id
    valor
    distancia
    duracao
    status
  }
}
```

### 7. Selecionar Motorista para Corrida

```graphql
mutation {
  selecionarMotoristaParaCorrida(
    corridaId: 1
    motoristaId: 1
  ) {
    id
    status
    motorista {
      id
      nome
    }
  }
}
```

## 📊 Estrutura de Pastas

```
API-Bubber/
├── api-graphql/              # Servidor GraphQL (Node.js)
│   ├── src/
│   │   ├── server.ts
│   │   ├── resolvers/
│   │   ├── schema/
│   │   ├── lib/
│   │   └── services/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── service-motoristas/       # Microsserviço de Motoristas (Python)
│   ├── app/
│   │   ├── models.py
│   │   ├── services.py
│   │   ├── database.py
│   │   └── grpc_stubs/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── service-roteamento/       # Microsserviço de Roteamento (Python)
│   ├── app/
│   │   ├── services.py
│   │   └── grpc_stubs/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── proto/                    # Definições gRPC
│   ├── motoristas.proto
│   └── roteamento.proto
│
├── docker-compose.yml        # Orquestração de containers
├── generate-grpc-stubs.sh    # Script para gerar stubs gRPC
├── .env                      # Variáveis de ambiente
└── README.md                 # Este arquivo
```

## 🔧 Desenvolvimento Local

### Setup API GraphQL

```bash
cd api-graphql
npm install
npm run prisma:migrate
npm run dev
```

### Setup Microsserviço de Motoristas

```bash
cd service-motoristas
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Setup Microsserviço de Roteamento

```bash
cd service-roteamento
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## 📡 gRPC

### Gerar Stubs

```bash
# Executar script bash
./generate-grpc-stubs.sh

# Ou manualmente (Python)
python -m grpc_tools.protoc -I./proto --python_out=./service-motoristas/app/grpc_stubs --grpc_python_out=./service-motoristas/app/grpc_stubs ./proto/motoristas.proto
```

### Portas gRPC

- **Motoristas**: 50051
- **Roteamento**: 50052

## 🗺️ OpenStreetMap

O sistema usa OSRM (OpenStreetMap Routing Machine) para cálculo de rotas.

### Download de Dados

```bash
# Criar pasta para dados
mkdir osrm-data

# Download do Brasil (requer ~400MB de espaço)
wget https://download.geofabrik.de/south-america/brazil-latest.osm.pbf -O osrm-data/brazil-latest.osm.pbf

# Ou para uma região específica:
# São Paulo
wget https://download.geofabrik.de/south-america/brazil/sao-paulo-latest.osm.pbf

# Processar com OSRM (dentro do container)
docker-compose exec osrm osrm-extract -p /usr/share/osrm/profiles/car.lua /data/brazil-latest.osm.pbf
docker-compose exec osrm osrm-partition /data/brazil-latest.osrm
docker-compose exec osrm osrm-customize /data/brazil-latest.osrm
```

## 🧪 Testes

### Testar API GraphQL

```bash
# Abrir Sandbox Apollo
http://localhost:4000
```

### Testar gRPC com grpcurl

```bash
# Instalar grpcurl
brew install grpcurl  # macOS
# ou
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest  # Go

# Chamar método gRPC
grpcurl -plaintext -d '{"latitude": -23.5505, "longitude": -46.6333, "raio_km": 5}' \
  localhost:50051 motoristas.MotoristaService/EncontrarMotoristasProximos
```

## 🐛 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs -f service-name

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Erro de conexão gRPC
```bash
# Verificar se porta está aberta
netstat -an | grep 50051

# Verificar conectividade entre containers
docker-compose exec api-graphql nc -zv service-motoristas 50051
```

### OSRM não funciona
```bash
# Verificar se dados estão presentes
ls -lh osrm-data/

# Reiniciar OSRM
docker-compose down osrm
docker-compose up -d --profile osrm osrm
```

## 📚 Referências

- [gRPC Documentation](https://grpc.io/docs/)
- [OSRM API Documentation](http://project-osrm.org/docs/v5.28.0/api/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

## 📄 Licença

MIT License

## 👥 Contribuidores

- Seu Nome

---

**Desenvolvido para a disciplina de Arquitetura de Software - CEFET**
