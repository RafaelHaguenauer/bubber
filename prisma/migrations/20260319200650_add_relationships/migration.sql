ALTER TABLE "Corrida" ADD COLUMN     "motoristaId" INTEGER NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL,
ADD COLUMN     "veiculoId" INTEGER NOT NULL;

ALTER TABLE "Pagamento" ADD COLUMN     "corridaId" INTEGER NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

CREATE UNIQUE INDEX "Pagamento_corridaId_key" ON "Pagamento"("corridaId");

ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Corrida" ADD CONSTRAINT "Corrida_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_corridaId_fkey" FOREIGN KEY ("corridaId") REFERENCES "Corrida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
