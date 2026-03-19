CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Motorista" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnh" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Motorista_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "cor" TEXT NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Corrida" (
    "id" SERIAL NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Corrida_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "forma" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

CREATE UNIQUE INDEX "Motorista_cnh_key" ON "Motorista"("cnh");
