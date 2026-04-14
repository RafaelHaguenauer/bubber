# 🚀 QUICK START - BUBBER (Windows)

## ⚡ Iniciar em 2 Minutos

### Pré-requisitos
- ✅ Docker Desktop instalado ([Download](https://www.docker.com/products/docker-desktop))
- ✅ Docker funcionando
- ✅ 8GB RAM disponível (4GB mínimo)

### Passo 1: Navegar para o Projeto
```bash
cd "c:\Users\rafin\OneDrive\Desktop\Pessoal\CEFET\Arquitetura de software\202601\API-Bubber"
```

### Passo 2: Executar Script de Inicialização
```bash
start.bat
```

Ou manualmente:
```bash
docker-compose up -d
```

### Passo 3: Aguardar Inicialização (10 segundos)
```bash
docker-compose ps
```

Deve mostrar 5 containers: `postgres`, `api-graphql`, `service-motoristas`, `service-roteamento`, e opcionalmente `osrm`.

### Passo 4: Acessar a API
Abra no navegador:
```
http://localhost:4000
```

## ✅ Verificação Rápida

```bash
# 1. Verificar containers
docker-compose ps

# 2. Ver logs
docker-compose logs -f

# 3. Testar banco de dados
docker-compose exec postgres psql -U bubber_user -d bubber -c "\dt"

# 4. Testar GraphQL (pode usar curl)
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"{ usuarios { id nome } }\"}"
```

## 📝 Primeira Query GraphQL

Acesse http://localhost:4000 e copie/cole:

```graphql
query {
  usuarios {
    id
    nome
    email
  }
}
```

Clique em "Play" para executar.

## 🧪 Testar Tudo (Completo)

Veja o arquivo **TESTING.md** para testes completos.

## 🛑 Parar Serviços

```bash
docker-compose down
```

Remover dados:
```bash
docker-compose down -v
```

## 🗺️ Com OSRM (Roteamento Real)

Se deseja usar roteamento com mapas reais:

```bash
# 1. Download dados OSM (primeira vez)
# Veja OSRM_SETUP.md para instruções

# 2. Iniciar com OSRM
docker-compose --profile osrm up -d

# 3. Aguardar processamento (30+ minutos)
# Veja OSRM_SETUP.md
```

## 🐛 Problemas Comuns

### "Connection refused"
Aguarde 10 segundos para serviços iniciarem.

### "Docker not running"
Abra Docker Desktop.

### "Port already in use"
Mude porta em docker-compose.yml:
```yaml
ports:
  - "4001:4000"  # novo porta: 4001
```

### "Out of memory"
Aumente RAM do Docker em Preferences → Resources.

## 📁 Arquivos Principais

- **docker-compose.yml** - Configuração dos containers
- **start.bat** - Script de inicialização
- **README.md** - Documentação completa
- **TESTING.md** - Guia de testes
- **.env** - Variáveis de ambiente

## 🎯 Próximos Passos

1. ✅ `start.bat` (ou `docker-compose up -d`)
2. ✅ Aguardar 10 segundos
3. ✅ Abrir http://localhost:4000
4. ✅ Testar queries em TESTING.md
5. ✅ Ler README.md para mais opções

## 📚 Documentação

- **README.md** - Visão geral
- **TESTING.md** - Exemplos de testes
- **ARCHITECTURE.md** - Diagramas
- **OSRM_SETUP.md** - Roteamento
- **RELATORIO_IMPLEMENTACAO.md** - Detalhes

## 🔗 Recursos

- GraphQL Sandbox: http://localhost:4000
- PostgreSQL: localhost:5432
- Motoristas (gRPC): localhost:50051
- Roteamento (gRPC): localhost:50052

## 💬 Dúvidas?

Consulte **TESTING.md** ou **RELATORIO_IMPLEMENTACAO.md**.

---

**Pronto! Sistema ativo em http://localhost:4000** 🎉

