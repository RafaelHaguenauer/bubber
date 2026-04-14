#!/bin/bash

# Script para iniciar o Bubber com Docker Compose no Linux/macOS

echo "========================================"
echo "   BUBBER - Sistema de Ridesharing"
echo "========================================"
echo ""

read -p "Deseja incluir OSRM? (s/n) [default: s]: " INCLUDE_OSRM
INCLUDE_OSRM=${INCLUDE_OSRM:-s}

echo ""
echo "Iniciando containers..."
echo ""

if [ "$INCLUDE_OSRM" = "s" ] || [ "$INCLUDE_OSRM" = "S" ]; then
    echo "[+] Iniciando com OSRM (roteamento)"
    docker-compose --profile osrm up -d
else
    echo "[+] Iniciando sem OSRM"
    docker-compose up -d
fi

echo ""
echo "Aguardando inicialização dos containers..."
sleep 5

echo ""
echo "========================================"
echo "     Containers em Execução"
echo "========================================"
docker-compose ps

echo ""
echo "========================================"
echo "       Informações de Acesso"
echo "========================================"
echo ""
echo "API GraphQL:"
echo "  URL: http://localhost:4000"
echo "  Sandbox: http://localhost:4000/graphql"
echo ""
echo "PostgreSQL:"
echo "  Host: localhost"
echo "  Porta: 5432"
echo "  Usuario: bubber_user"
echo "  Senha: bubber_pass"
echo "  Banco: bubber"
echo ""
echo "Microsserviço de Motoristas (gRPC):"
echo "  Host: localhost"
echo "  Porta: 50051"
echo ""
echo "Microsserviço de Roteamento (gRPC):"
echo "  Host: localhost"
echo "  Porta: 50052"
echo ""
if [ "$INCLUDE_OSRM" = "s" ] || [ "$INCLUDE_OSRM" = "S" ]; then
    echo "OSRM:"
    echo "  URL: http://localhost:5000"
    echo ""
fi
echo "========================================"
echo ""
echo "Dicas úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar: docker-compose down"
echo "  - Rebuild: docker-compose build --no-cache"
echo ""
