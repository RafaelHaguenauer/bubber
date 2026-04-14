FROM node:20-alpine

WORKDIR /app

# Instalar protobuf-compiler
RUN apk add --no-cache protobuf openssl

# Copiar arquivos de configuração
COPY api-graphql/package.json ./
COPY api-graphql/tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY api-graphql/prisma ./prisma
COPY api-graphql/src ./src
COPY proto ./proto

# Gerar cliente Prisma antes da compilação TypeScript
RUN npm run prisma:generate

# Build do TypeScript
RUN npm run build

# Copiar arquivos necessários para runtime
COPY api-graphql/src/schema ./dist/schema

# Expor porta
EXPOSE 4000

# Comando para iniciar
CMD ["npm", "start"]
