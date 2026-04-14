#!/bin/bash

# Script para gerar stubs gRPC

echo "🔧 Gerando stubs gRPC..."

# Python - Motoristas
python -m grpc_tools.protoc \
  -I./proto \
  --python_out=./service-motoristas/app/grpc_stubs \
  --pyi_out=./service-motoristas/app/grpc_stubs \
  --grpc_python_out=./service-motoristas/app/grpc_stubs \
  ./proto/motoristas.proto

echo "✓ Stubs de motoristas gerados"

# Python - Roteamento
python -m grpc_tools.protoc \
  -I./proto \
  --python_out=./service-roteamento/app/grpc_stubs \
  --pyi_out=./service-roteamento/app/grpc_stubs \
  --grpc_python_out=./service-roteamento/app/grpc_stubs \
  ./proto/roteamento.proto

echo "✓ Stubs de roteamento gerados"

echo "✅ Todos os stubs gRPC foram gerados com sucesso!"
