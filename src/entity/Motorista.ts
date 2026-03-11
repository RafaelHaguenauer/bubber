import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Motorista {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  cnh!: string;

  @Column()
  telefone!: string;
}