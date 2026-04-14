FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY service-motoristas/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar arquivos proto
COPY proto ./proto

# Copiar código da aplicação
COPY service-motoristas/. .

# Gerar stubs gRPC a partir dos arquivos proto
RUN mkdir -p ./grpc_stubs
RUN python -m grpc_tools.protoc -I./proto --python_out=./grpc_stubs --pyi_out=./grpc_stubs --grpc_python_out=./grpc_stubs ./proto/motoristas.proto

# Expor porta
EXPOSE 50051

# Comando para iniciar o servidor
CMD ["python", "main.py"]
