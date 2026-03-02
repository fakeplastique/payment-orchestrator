import { Column, Entity, Index, OneToMany } from "typeorm";
import { Integrations } from "./Integrations";
import { Users } from "./Users";

@Index("companies_pkey", ["id"], { unique: true })
@Entity("companies", { schema: "public" })
export class Companies {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "api_key_hash", length: 255 })
  apiKeyHash: string;

  @Column("timestamp without time zone", {
    name: "created_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDate: Date | null;

  @OneToMany(() => Integrations, (integrations) => integrations.company)
  integrations: Integrations[];

  @OneToMany(() => Users, (users) => users.company)
  users: Users[];
}
