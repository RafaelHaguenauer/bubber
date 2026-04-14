FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY service-roteamento/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar arquivos proto
COPY proto ./proto

# Copiar código da aplicação
COPY service-roteamento/. .

# Gerar stubs gRPC a partir dos arquivos proto
RUN python -m grpc_tools.protoc -I./proto --python_out=./app/grpc_stubs --pyi_out=./app/grpc_stubs --grpc_python_out=./app/grpc_stubs ./proto/roteamento.proto

# Expor porta
EXPOSE 50052

# Comando para iniciar o servidor
CMD ["python", "main.py"]
