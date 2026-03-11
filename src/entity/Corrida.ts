import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Corrida {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  origem!: string;

  @Column()
  destino!: string;

  @Column("decimal")
  valor!: number;

  @Column()
  status!: string;
}