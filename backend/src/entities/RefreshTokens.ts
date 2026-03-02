import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users";

@Index("refresh_tokens_pkey", ["id"], { unique: true })
@Index("refresh_tokens_token_hash_idx", ["tokenHash"], { unique: true })
@Entity("refresh_tokens", { schema: "public" })
export class RefreshTokens {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Column("character varying", { name: "token_hash", length: 255 })
  tokenHash: string;

  @Column("timestamp without time zone", { name: "expires_at" })
  expiresAt: Date;

  @Column("boolean", { name: "is_revoked", default: false })
  isRevoked: boolean;

  @Column("timestamp without time zone", {
    name: "created_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDate: Date;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
