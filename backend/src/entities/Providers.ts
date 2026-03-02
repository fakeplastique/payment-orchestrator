import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Integrations } from "./Integrations";

@Index("providers_pkey", ["id"], { unique: true })
@Entity("providers", { schema: "public" })
export class Providers {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @OneToMany(() => Integrations, (integrations) => integrations.provider)
  integrations: Integrations[];
}
