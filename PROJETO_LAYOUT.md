# 📂 ESTRUTURA VISUAL FINAL - BUBBER

```
API-Bubber/
│
├── 📄 README.md                          (Documentação principal - LEIA PRIMEIRO!)
├── 📄 TESTING.md                         (Guia completo de testes)
├── 📄 ARCHITECTURE.md                    (Diagramas da arquitetura)
├── 📄 OSRM_SETUP.md                      (Como configurar OpenStreetMap)
├── 📄 RELATORIO_IMPLEMENTACAO.md         (Relatório completo do projeto)
├── 📄 CHECKLIST.md                       (Checklist de implementação)
├── 📄 PROJETO_LAYOUT.md                  (Este arquivo)
│
├── 🟦 docker-compose.yml                 (Orquestração principal)
├── 🟦 start.bat                          (Script para Windows)
├── 🟦 start.sh                           (Script para Linux/macOS)
├── 🟦 generate-grpc-stubs.sh             (Gera stubs gRPC)
├── 🟦 .env                               (Variáveis de ambiente)
├── 🟦 .gitignore                         (Ignora arquivos desnecessários)
│
├─ 📁 api-graphql/                        (SERVIÇO: API GraphQL - Node.js)
│  ├── 📄 README.md
│  ├── 🟦 package.json                    (Dependências NPM)
│  ├── 🟦 tsconfig.json                   (Configuração TypeScript)
│  ├── 🟦 Dockerfile
│  ├── 🟦 .env.example
│  │
│  ├─ 📁 src/
│  │  ├── 🟪 server.ts                    (Servidor Apollo + inicialização gRPC)
│  │  │
│  │  ├─ 📁 resolvers/
│  │  │  └── 🟪 index.ts                  (Queries e Mutations GraphQL)
│  │  │
│  │  ├─ 📁 schema/
│  │  │  └── 🟧 schema.graphql            (Definição do schema GraphQL)
│  │  │
│  │  ├─ 📁 lib/
│  │  │  ├── 🟪 grpc-client.ts            (Cliente gRPC para microsserviços)
│  │  │  └── 🟪 prisma.ts                 (Instância Prisma)
│  │  │
│  │  ├─ 📁 services/                     (Lógica de negócio)
│  │  └─ 📁 types/
│  │
│  └─ 📁 prisma/
│     ├── 🟧 schema.prisma                (Modelo de dados)
│     ├── 🟧 seed.ts                      (Seed de dados)
│     └─ 📁 migrations/
│        ├── 🟧 migration_lock.toml
│        └─ 📁 20260319200214_init/
│           └── 🟧 migration.sql
│
├─ 📁 service-motoristas/                 (SERVIÇO: Motoristas - Python/gRPC)
│  ├── 🟪 main.py                         (Servidor gRPC)
│  ├── 🟦 requirements.txt                (Dependências Python)
│  ├── 🟦 Dockerfile
│  ├── 🟦 .env.example
│  │
│  └─ 📁 app/
│     ├── 🟪 __init__.py
│     ├── 🟪 models.py                    (Modelos Pydantic)
│     ├── 🟪 services.py                  (Lógica: Haversine, BD, etc)
│     ├── 🟪 database.py                  (SQLAlchemy + ORM)
│     └─ 📁 grpc_stubs/                   (Gerado automaticamente)
│        ├── 🟪 motoristas_pb2.py
│        ├── 🟪 motoristas_pb2_grpc.py
│        └── 🟪 motoristas_pb2.pyi
│
├─ 📁 service-roteamento/                 (SERVIÇO: Roteamento - Python/gRPC)
│  ├── 🟪 main.py                         (Servidor gRPC)
│  ├── 🟦 requirements.txt                (Dependências Python)
│  ├── 🟦 Dockerfile
│  ├── 🟦 .env.example
│  │
│  └─ 📁 app/
│     ├── 🟪 __init__.py
│     ├── 🟪 services.py                  (Lógica: OSRM API calls)
│     └─ 📁 grpc_stubs/                   (Gerado automaticamente)
│        ├── 🟪 roteamento_pb2.py
│        ├── 🟪 roteamento_pb2_grpc.py
│        └── 🟪 roteamento_pb2.pyi
│
├─ 📁 proto/                              (DEFINIÇÕES gRPC)
│  ├── 🟧 motoristas.proto                (API do serviço de motoristas)
│  └── 🟧 roteamento.proto                (API do serviço de roteamento)
│
├─ 📁 osrm-data/                          (DADOS - Não incluído, download necessário)
│  ├── 🟦 brazil-latest.osm.pbf           (~400MB, baixar de Geofabrik)
│  ├── 🟦 brazil-latest.osrm              (Gerado após processamento)
│  ├── 🟦 brazil-latest.osrm.partition
│  ├── 🟦 brazil-latest.osrm.customization
│  └── 🟦 brazil-latest.osrm.cnbg
│
└─ 📁 node_modules/                       (NPM packages - Gerado automaticamente)

```

## 🎯 Legenda

| Símbolo | Tipo | Descrição |
|---------|------|-----------|
| 📄 | Markdown | Arquivo de documentação |
| 🟦 | Config | Arquivo de configuração |
| 🟪 | Código | Arquivo de código-fonte |
| 🟧 | Data | Arquivo de definição/schema |
| 📁 | Pasta | Diretório |

## 🚀 COMO USAR ESTE PROJETO

### Passo 1: Inicial Rápido (5 minutos)
```bash
cd API-Bubber
start.bat                    # Windows
# ou
./start.sh                   # Linux/macOS

# Aguarde ~10 segundos
# Acesse: http://localhost:4000
```

### Passo 2: Ler Documentação
1. **README.md** - Visão geral e como começar
2. **TESTING.md** - Como testar cada serviço
3. **ARCHITECTURE.md** - Entender a arquitetura
4. **OSRM_SETUP.md** - Se quiser usar roteamento real

### Passo 3: Testar APIs
- Abra http://localhost:4000 no navegador
- Cole as queries/mutations do TESTING.md
- Teste os microsserviços com grpcurl

### Passo 4: Desenvolvimento
- Modifique código em `src/`
- Refazer containers: `docker-compose build --no-cache && docker-compose up`
- Consulte TESTING.md para troubleshooting

## 📊 SERVIÇOS & PORTAS

| Serviço | Tipo | Porta | URL |
|---------|------|-------|-----|
| API GraphQL | HTTP | 4000 | http://localhost:4000 |
| Motoristas | gRPC | 50051 | localhost:50051 |
| Roteamento | gRPC | 50052 | localhost:50052 |
| PostgreSQL | SQL | 5432 | postgres://user:pass@localhost:5432/bubber |
| OSRM | HTTP | 5000 | http://localhost:5000 (opcional) |

## ✅ CHECKLIST DE INÍCIO

- [ ] Clonar/extrair projeto
- [ ] Navegar para pasta `API-Bubber`
- [ ] Executar `start.bat` ou `./start.sh`
- [ ] Aguardar 10 segundos
- [ ] Acessar http://localhost:4000
- [ ] Testar primeira mutation (criarUsuario)
- [ ] Ver logs: `docker-compose logs -f`
- [ ] Ler README.md para próximos passos

## 🔗 ARQUIVOS IMPORTANTES (em ordem de leitura)

1. **README.md** - Comece aqui!
2. **TESTING.md** - Como testar
3. **ARCHITECTURE.md** - Entender design
4. **OSRM_SETUP.md** - Se usar roteamento
5. **RELATORIO_IMPLEMENTACAO.md** - Detalhes técnicos
6. **CHECKLIST.md** - Validar implementação

## 💾 TAMANHO DO PROJETO

| Componente | Tamanho |
|---|---|
| Código-fonte | ~1.5 MB |
| Dockerfiles | ~50 KB |
| Documentação | ~300 KB |
| Docker images | ~2-3 GB (após build) |
| OSM data (opcional) | ~400 MB (São Paulo) |
| **Total** | **~3.7 GB** (com dados) |

## 🆘 AJUDA RÁPIDA

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f api-graphql

# Parar tudo
docker-compose down

# Resetar (apaga dados)
docker-compose down -v

# Rebuild
docker-compose build --no-cache
```

## 📞 PRÓXIMAS ETAPAS

1. Executar o projeto: `start.bat`
2. Acessar GraphQL: http://localhost:4000
3. Testar usando exemplos em TESTING.md
4. Modificar código conforme necessário
5. Para produção: ver RELATORIO_IMPLEMENTACAO.md

---

**Projeto finalizado em:** 13 de Abril de 2026  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para usar

