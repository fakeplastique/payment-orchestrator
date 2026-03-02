import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { FraudChecks } from "./FraudChecks";
import { RawLogs } from "./RawLogs";
import { Integrations } from "./Integrations";

@Index("transactions_pkey", ["id"], { unique: true })
@Entity("transactions", { schema: "public" })
export class Transactions {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", {
    name: "external_id",
    nullable: true,
    length: 255,
  })
  externalId: string | null;

  @Column("numeric", { name: "amount", precision: 19, scale: 4 })
  amount: string;

  @Column("character varying", { name: "currency", length: 3 })
  currency: string;

  @Column("character varying", { name: "status", length: 50 })
  status: string;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDate: Date | null;

  @OneToMany(() => FraudChecks, (fraudChecks) => fraudChecks.transaction)
  fraudChecks: FraudChecks[];

  @OneToMany(() => RawLogs, (rawLogs) => rawLogs.transaction)
  rawLogs: RawLogs[];

  @ManyToOne(() => Integrations, (integrations) => integrations.transactions)
  @JoinColumn([{ name: "integration_id", referencedColumnName: "id" }])
  integration: Integrations;
}
