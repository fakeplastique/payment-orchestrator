import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transactions } from "./Transactions";

@Index("raw_logs_pkey", ["id"], { unique: true })
@Entity("raw_logs", { schema: "public" })
export class RawLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("jsonb", { name: "payload" })
  payload: object;

  @ManyToOne(() => Transactions, (transactions) => transactions.rawLogs, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "transaction_id", referencedColumnName: "id" }])
  transaction: Transactions;
}
