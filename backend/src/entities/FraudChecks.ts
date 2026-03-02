import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { FraudRules } from "./FraudRules";
import { Transactions } from "./Transactions";

@Index("fraud_checks_pkey", ["id"], { unique: true })
@Entity("fraud_checks", { schema: "public" })
export class FraudChecks {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("double precision", { name: "score", precision: 53 })
  score: number;

  @Column("boolean", {
    name: "is_flagged",
    nullable: true,
    default: () => "false",
  })
  isFlagged: boolean | null;

  @Column("timestamp without time zone", {
    name: "check_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  checkDate: Date | null;

  @ManyToOne(() => FraudRules, (fraudRules) => fraudRules.fraudChecks)
  @JoinColumn([{ name: "rule_id", referencedColumnName: "id" }])
  rule: FraudRules;

  @ManyToOne(() => Transactions, (transactions) => transactions.fraudChecks, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "transaction_id", referencedColumnName: "id" }])
  transaction: Transactions;
}
