-- Base schema for Payment Orchestrator
-- This runs once when the PostgreSQL container is first created

CREATE TABLE IF NOT EXISTS "providers" (
  "id" SERIAL PRIMARY KEY,
  "name" character varying(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "companies" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" character varying(255) NOT NULL,
  "api_key_hash" character varying(255) NOT NULL,
  "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" character varying(255) NOT NULL,
  "password_hash" character varying(255) NOT NULL,
  "role" character varying(50) NOT NULL,
  "last_login_date" TIMESTAMP,
  "company_id" uuid,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "users_email_key" UNIQUE ("email"),
  CONSTRAINT "FK_users_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "integrations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "credentials" jsonb NOT NULL,
  "is_enabled" boolean DEFAULT true,
  "company_id" uuid,
  "provider_id" integer,
  CONSTRAINT "integrations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FK_integrations_company" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_integrations_provider" FOREIGN KEY ("provider_id") REFERENCES "providers"("id")
);

CREATE TABLE IF NOT EXISTS "transactions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "external_id" character varying(255),
  "amount" numeric(19,4) NOT NULL,
  "currency" character varying(3) NOT NULL,
  "status" character varying(50) NOT NULL,
  "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "integration_id" uuid,
  CONSTRAINT "transactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FK_transactions_integration" FOREIGN KEY ("integration_id") REFERENCES "integrations"("id")
);

CREATE TABLE IF NOT EXISTS "fraud_rules" (
  "id" SERIAL PRIMARY KEY,
  "name" character varying(255) NOT NULL,
  "threshold" numeric(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "fraud_checks" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "score" double precision NOT NULL,
  "is_flagged" boolean DEFAULT false,
  "check_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "rule_id" integer,
  "transaction_id" uuid,
  CONSTRAINT "fraud_checks_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FK_fraud_checks_rule" FOREIGN KEY ("rule_id") REFERENCES "fraud_rules"("id"),
  CONSTRAINT "FK_fraud_checks_transaction" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "action" character varying(255) NOT NULL,
  "old_values" jsonb,
  "new_values" jsonb,
  "performed_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "user_id" uuid,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FK_audit_logs_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "raw_logs" (
  "id" BIGSERIAL PRIMARY KEY,
  "payload" jsonb NOT NULL,
  "transaction_id" uuid,
  CONSTRAINT "FK_raw_logs_transaction" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE
);

-- Refresh tokens table (for JWT auth)
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "token_hash" character varying(255) NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "is_revoked" boolean NOT NULL DEFAULT false,
  "created_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "user_id" uuid,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FK_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "refresh_tokens_token_hash_idx" ON "refresh_tokens" ("token_hash");

-- TypeORM migrations tracking table
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" SERIAL PRIMARY KEY,
  "timestamp" bigint NOT NULL,
  "name" character varying(255) NOT NULL
);

-- Mark the initial migration as already run (since init.sql handles it)
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1709300000000, 'AddRefreshTokens1709300000000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'AddRefreshTokens1709300000000');
