-- ============================================================================
-- Row-Level Security (RLS) policies — Shiva Estate / Artha investor portal
-- Apply in: Supabase Dashboard → SQL Editor → run this script.
-- ============================================================================
--
-- ⚠️ READ THIS FIRST — RLS is NOT your primary access control here.
--
-- This app reads/writes the database through PRISMA, using the DATABASE_URL
-- connection. That connection authenticates as a Postgres role that BYPASSES
-- RLS (the table owner / a BYPASSRLS role). So these policies do NOT restrict
-- the app's own Prisma queries.
--
-- What these policies DO protect:
--   • Direct access via the Supabase Data API (PostgREST) using the anon /
--     authenticated keys — e.g. if a client ever queries Supabase directly,
--     or a key leaks.
--   • Supabase Storage / realtime if you expose tables there.
--
-- They are defense-in-depth. The REAL guarantee that "investor A cannot see
-- investor B's data" must be enforced in the APP QUERY LAYER: every investor
-- query must be scoped by the logged-in user, e.g.
--
--     const investor = await prisma.investor.findUnique({
--       where: { supabaseId: user.id },   // user.id from supabase.auth.getUser()
--     })
--     const investments = await prisma.investment.findMany({
--       where: { investorId: investor.id },
--     })
--
-- Do NOT rely on the request body to tell you which investor is asking —
-- always derive it from the verified session (auth.getUser()).
--
-- Mapping note: auth.uid() returns the Supabase user UUID; we store it as
-- text in "Investor"."supabaseId", hence auth.uid()::text below.
-- ============================================================================

-- ── Enable RLS on investor-scoped tables ────────────────────────────────────
alter table "Investor"     enable row level security;
alter table "Investment"   enable row level security;
alter table "Payment"      enable row level security;
alter table "Document"     enable row level security;
alter table "Notification" enable row level security;

-- ── Investor: can read only their own profile row ───────────────────────────
drop policy if exists "investor_self_select" on "Investor";
create policy "investor_self_select" on "Investor"
  for select using ("supabaseId" = auth.uid()::text);

-- ── Investment: can read only investments they own ──────────────────────────
drop policy if exists "investment_owner_select" on "Investment";
create policy "investment_owner_select" on "Investment"
  for select using (
    "investorId" in (
      select id from "Investor" where "supabaseId" = auth.uid()::text
    )
  );

-- ── Payment: readable via owned investment ──────────────────────────────────
drop policy if exists "payment_owner_select" on "Payment";
create policy "payment_owner_select" on "Payment"
  for select using (
    "investmentId" in (
      select inv.id
      from "Investment" inv
      join "Investor" i on i.id = inv."investorId"
      where i."supabaseId" = auth.uid()::text
    )
  );

-- ── Document: investor's own, and only those marked visible ──────────────────
drop policy if exists "document_owner_select" on "Document";
create policy "document_owner_select" on "Document"
  for select using (
    "investorId" in (
      select id from "Investor" where "supabaseId" = auth.uid()::text
    )
    and "isVisibleToInvestor" = true
  );

-- ── Notification: investor's own ─────────────────────────────────────────────
drop policy if exists "notification_owner_select" on "Notification";
create policy "notification_owner_select" on "Notification"
  for select using (
    "investorId" in (
      select id from "Investor" where "supabaseId" = auth.uid()::text
    )
  );

-- Investors get NO insert/update/delete via the data API by default (no such
-- policies created) — all writes go through the app's server routes (Prisma).
-- Builder-admin access should likewise run server-side via Prisma or the
-- service-role key, NOT via broad authenticated policies.
-- ============================================================================
