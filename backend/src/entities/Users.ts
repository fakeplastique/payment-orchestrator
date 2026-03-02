import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AuditLogs } from "./AuditLogs";
import { Companies } from "./Companies";

@Index("users_email_key", ["email"], { unique: true })
@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("character varying", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("character varying", { name: "role", length: 50 })
  role: string;

  @Column("timestamp without time zone", {
    name: "last_login_date",
    nullable: true,
  })
  lastLoginDate: Date | null;

  @OneToMany(() => AuditLogs, (auditLogs) => auditLogs.user)
  auditLogs: AuditLogs[];

  @Column("uuid", { name: "company_id" })
  companyId: string;

  @ManyToOne(() => Companies, (companies) => companies.users, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: Companies;
}
