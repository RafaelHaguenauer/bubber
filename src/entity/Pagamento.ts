import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Pagamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  forma!: string;

  @Column("decimal")
  valor!: number;

  @Column()
  status!: string;
}