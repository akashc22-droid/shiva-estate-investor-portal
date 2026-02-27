-- Migration: add_artha_whitelabel
-- Adds Artha platform multi-tenancy fields to the Builder model

ALTER TABLE "Builder"
  ADD COLUMN IF NOT EXISTS "accentColor"   TEXT        NOT NULL DEFAULT '#1A1A2E',
  ADD COLUMN IF NOT EXISTS "faviconUrl"    TEXT,
  ADD COLUMN IF NOT EXISTS "tagline"       TEXT,
  ADD COLUMN IF NOT EXISTS "customDomain"  TEXT        UNIQUE,
  ADD COLUMN IF NOT EXISTS "showPoweredBy" BOOLEAN     NOT NULL DEFAULT true;

-- Create BuilderTier enum
DO $$ BEGIN
  CREATE TYPE "BuilderTier" AS ENUM ('STARTER', 'GROWTH', 'ENTERPRISE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Builder"
  ADD COLUMN IF NOT EXISTS "tier" "BuilderTier" NOT NULL DEFAULT 'STARTER';
