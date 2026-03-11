import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Veiculo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  modelo!: string;

  @Column()
  placa!: string;

  @Column()
  cor!: string;
}