# 🧪 Guia de Testes - Bubber

Este documento contém exemplos de testes para validar toda a arquitetura.

## 📋 Testes de Integração

### 1. **Verificar Status dos Containers**

```bash
# Listar containers em execução
docker-compose ps

# Deve mostrar todos os 5 containers: postgres, osrm, api-graphql, 
# service-motoristas, service-roteamento
```

### 2. **Testar Conectividade PostgreSQL**

```bash
# Conectar ao banco
docker-compose exec postgres psql -U bubber_user -d bubber

# Listar tabelas
\dt

# Sair
\q
```

### 3. **Testar API GraphQL**

Acesse: **http://localhost:4000**

#### 3.1 - Criar um Usuário

```graphql
mutation {
  criarUsuario(
    nome: "João Silva"
    email: "joao@example.com"
    telefone: "11987654321"
  ) {
    id
    nome
    email
    telefone
    createdAt
  }
}
```

**Resposta Esperada:**
```json
{
  "data": {
    "criarUsuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "telefone": "11987654321",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 3.2 - Criar um Veículo

```graphql
mutation {
  criarVeiculo(
    modelo: "Toyota Corolla"
    placa: "ABC1234"
    cor: "Preto"
    renavam: "00000000000000"
  ) {
    id
    modelo
    placa
    cor
  }
}
```

#### 3.3 - Criar um Motorista

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
    avaliacao
  }
}
```

#### 3.4 - Atualizar Localização do Motorista

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
    nome
  }
}
```

#### 3.5 - Buscar Motoristas Próximos

Primeiro, adicione outro motorista com localização diferente:

```graphql
mutation {
  criarMotorista(
    nome: "Maria Santos"
    cnh: "98765432109"
    telefone: "11999999999"
  ) {
    id
  }
}

# Atualizar sua localização
mutation {
  atualizarLocalizacaoMotorista(
    id: 2
    latitude: -23.5520
    longitude: -46.6340
  ) {
    id
  }
}
```

Agora busque:

```graphql
query {
  motoristasPróximos(
    latitude: -23.5505
    longitude: -46.6333
    raioKm: 10
  ) {
    motorista {
      id
      nome
      telefone
      disponivel
      avaliacao
    }
    distancia
    tempo
  }
}
```

**Resposta Esperada:**
```json
{
  "data": {
    "motoristasPróximos": [
      {
        "motorista": {
          "id": 2,
          "nome": "Maria Santos",
          "telefone": "11999999999",
          "disponivel": true,
          "avaliacao": 5.0
        },
        "distancia": 2.14,
        "tempo": 3
      },
      {
        "motorista": {
          "id": 1,
          "nome": "Pedro Costa",
          "telefone": "11988888888",
          "disponivel": true,
          "avaliacao": 5.0
        },
        "distancia": 0.0,
        "tempo": 1
      }
    ]
  }
}
```

#### 3.6 - Calcular Rota (com OSRM)

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

**Resposta Esperada:**
```json
{
  "data": {
    "calcularRota": {
      "distanciaEmKm": 8.5,
      "duracaoEmMinutos": 12,
      "distancia": 8500,
      "duracao": 720
    }
  }
}
```

#### 3.7 - Criar uma Corrida

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
    origemLat
    origemLon
    destinoLat
    destinoLon
  }
}
```

**Resposta Esperada:**
```json
{
  "data": {
    "criarCorrida": {
      "id": 1,
      "valor": 26.25,
      "distancia": 8.5,
      "duracao": 12,
      "status": "pendente",
      "origemLat": -23.5505,
      "origemLon": -46.6333,
      "destinoLat": -23.5890,
      "destinoLon": -46.6760
    }
  }
}
```

#### 3.8 - Selecionar Motorista para Corrida

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
      disponivel
    }
  }
}
```

**Resposta Esperada:**
```json
{
  "data": {
    "selecionarMotoristaParaCorrida": {
      "id": 1,
      "status": "confirmada",
      "motorista": {
        "id": 1,
        "nome": "Pedro Costa",
        "disponivel": false
      }
    }
  }
}
```

#### 3.9 - Criar Pagamento

```graphql
mutation {
  criarPagamento(
    corridaId: 1
    forma: "Cartão de Crédito"
    valor: 26.25
  ) {
    id
    forma
    valor
    status
    corrida {
      id
      valor
    }
  }
}
```

### 4. **Testar Microsserviço de Motoristas (gRPC)**

```bash
# Instalar grpcurl (se não tiver)
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest

# Listar serviços disponíveis
grpcurl -plaintext localhost:50051 list

# Chamar método: EncontrarMotoristasProximos
grpcurl -plaintext -d '{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "raio_km": 5
}' \
  localhost:50051 motoristas.MotoristaService/EncontrarMotoristasProximos

# Resultado esperado:
# {
#   "motoristas": [
#     {
#       "motorista_id": 1,
#       "latitude": -23.5505,
#       "longitude": -46.6333,
#       "distancia": 0,
#       "tempo_minutos": 1,
#       "avaliacao": 5,
#       "nome": "Pedro Costa"
#     }
#   ]
# }
```

### 5. **Testar Microsserviço de Roteamento (gRPC)**

```bash
# Listar serviços disponíveis
grpcurl -plaintext localhost:50052 list

# Chamar método: CalcularRota
grpcurl -plaintext -d '{
  "origem_lat": -23.5505,
  "origem_lon": -46.6333,
  "destino_lat": -23.5890,
  "destino_lon": -46.6760
}' \
  localhost:50052 roteamento.RoteamentoService/CalcularRota

# Resultado esperado:
# {
#   "distancia_metros": 8500,
#   "duracao_segundos": 720,
#   "passos": [
#     {
#       "instrucao": "Siga para nordeste na ...",
#       "distancia_metros": 250,
#       "duracao_segundos": 20,
#       "nome_rua": "Avenida Paulista"
#     }
#   ]
# }
```

### 6. **Testar Conectividade OSRM**

```bash
# Verificar status do OSRM
curl http://localhost:5000/status

# Deveria retornar:
# {"status":0,"data":"running"}

# Chamar rota diretamente
curl "http://localhost:5000/route/v1/driving/-46.6333,-23.5505;-46.6760,-23.5890?steps=true&geometries=polyline&overview=full"
```

## 🔍 Verificação de Logs

```bash
# Ver todos os logs
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs -f api-graphql
docker-compose logs -f service-motoristas
docker-compose logs -f service-roteamento
docker-compose logs -f postgres
docker-compose logs -f osrm

# Últimas 100 linhas
docker-compose logs -n 100
```

## 🧹 Limpeza e Reset

```bash
# Parar containers
docker-compose down

# Remover volumes (apagar dados do banco)
docker-compose down -v

# Rebuild completo
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Performance

```bash
# Monitorar uso de recursos
docker stats

# Ver detalhes de um container
docker inspect bubber-api-graphql
```

## ✅ Checklist de Validação

- [ ] Todos os 5 containers estão rodando
- [ ] PostgreSQL aceita conexões
- [ ] API GraphQL responde em http://localhost:4000
- [ ] Motoristas podem ser criados e listados
- [ ] Usuários podem ser criados e localizados
- [ ] Motoristas próximos são encontrados via gRPC
- [ ] Rotas são calculadas via OSRM
- [ ] Corridas podem ser criadas com valor calculado automaticamente
- [ ] Motoristas podem ser selecionados para corridas
- [ ] Pagamentos podem ser criados

## 🐛 Troubleshooting Comum

### Erro: "Cannot connect to Docker daemon"
- Docker não está rodando. Inicie o Docker Desktop.

### Erro: "service-motoristas: GRPC:127.0.0.1:50051: connection refused"
- O microsserviço ainda não iniciou. Aguarde ~10 segundos.
- Verifique logs: `docker-compose logs service-motoristas`

### Erro: "OSRM returned an error"
- OSRM pode não ter dados carregados. Verifique pasta `osrm-data/`
- Download dados: `wget https://download.geofabrik.de/south-america/brazil-latest.osm.pbf -O osrm-data/brazil-latest.osm.pbf`

### Erro: "Database connection refused"
- PostgreSQL pode estar travado. Reset:
```bash
docker-compose down -v
docker-compose up -d postgres
# Aguarde ~5 segundos
docker-compose up -d
```

---

**Última atualização:** Janeiro 2024
