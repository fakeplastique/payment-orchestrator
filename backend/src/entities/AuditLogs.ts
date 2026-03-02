import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("audit_logs_pkey", ["id"], { unique: true })
@Entity("audit_logs", { schema: "public" })
export class AuditLogs {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "action", length: 255 })
  action: string;

  @Column("jsonb", { name: "old_values", nullable: true })
  oldValues: object | null;

  @Column("jsonb", { name: "new_values", nullable: true })
  newValues: object | null;

  @Column("timestamp without time zone", {
    name: "performed_date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  performedDate: Date | null;

  @ManyToOne(() => Users, (users) => users.auditLogs, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
