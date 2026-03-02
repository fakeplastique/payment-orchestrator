import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FraudChecks } from "./FraudChecks";

@Index("fraud_rules_pkey", ["id"], { unique: true })
@Entity("fraud_rules", { schema: "public" })
export class FraudRules {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("numeric", { name: "threshold", precision: 10, scale: 2 })
  threshold: string;

  @OneToMany(() => FraudChecks, (fraudChecks) => fraudChecks.rule)
  fraudChecks: FraudChecks[];
}
