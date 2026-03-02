import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Companies } from "./Companies";
import { Providers } from "./Providers";
import { Transactions } from "./Transactions";

@Index("integrations_pkey", ["id"], { unique: true })
@Entity("integrations", { schema: "public" })
export class Integrations {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("jsonb", { name: "credentials" })
  credentials: object;

  @Column("boolean", {
    name: "is_enabled",
    nullable: true,
    default: () => "true",
  })
  isEnabled: boolean | null;

  @ManyToOne(() => Companies, (companies) => companies.integrations, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: Companies;

  @ManyToOne(() => Providers, (providers) => providers.integrations)
  @JoinColumn([{ name: "provider_id", referencedColumnName: "id" }])
  provider: Providers;

  @OneToMany(() => Transactions, (transactions) => transactions.integration)
  transactions: Transactions[];
}
