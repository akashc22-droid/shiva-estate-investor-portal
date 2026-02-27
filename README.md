# Shiva Estate Investor Portal — Powered by Artha

A premium investor relations platform built on the **Artha** multi-tenant SaaS platform.

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — use **Demo Login → Client Walkthrough** to explore.

---

## 🏢 Multi-Tenant Architecture (Artha Platform)

This app is a tenant on **artha.io**. Each builder gets their own subdomain:

| URL | Tenant |
|-----|--------|
| `shivaos.artha.io` | Shiva Estate (production) |
| `shivaos.localhost:3000` | Shiva Estate (local dev) |
| `localhost:3000` | Shiva Estate (default fallback) |

The middleware extracts the subdomain from the hostname and injects it as the
`x-builder-subdomain` request header. All pages and APIs read from this header
via `lib/brand.ts → getBuilderBrand(subdomain)`.

### Local Multi-Tenant Testing

To test subdomain routing locally, add the following to your `/etc/hosts` file:

```
# Artha platform — local multi-tenant testing
127.0.0.1  shivaos.localhost
```

Then open [`http://shivaos.localhost:3000`](http://shivaos.localhost:3000).

> **macOS/Linux**: `sudo nano /etc/hosts` and add the line above.
> **Windows**: Open `C:\Windows\System32\drivers\etc\hosts` as Administrator.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Auth (demo mode works without it) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Auth (demo mode works without it) |
| `DATABASE_URL` | Optional | Prisma DB (demo data used without it) |
| `ANTHROPIC_API_KEY` | Optional | AI return predictions |

Without any env vars, the app runs in **demo mode** — all pages use Shiva Estate
mock data and no auth is enforced.

---

## 🗄️ Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations (requires DATABASE_URL)
pnpm prisma migrate dev

# Seed demo data (requires DATABASE_URL)
pnpm db:seed
```

### Migrations

| Migration | Description |
|---|---|
| `20260227_add_artha_whitelabel` | Adds `accentColor`, `faviconUrl`, `tagline`, `customDomain`, `tier`, `showPoweredBy` to Builder |

---

## 🚀 Deployment (Vercel)

1. Connect GitHub repo `akashc22-droid/shiva-estate-investor-portal` to Vercel
2. Add env vars in Vercel → Settings → Environment Variables
3. `ANTHROPIC_API_KEY` is sufficient for the demo — all other vars are optional

The build script runs `prisma generate` automatically before `next build`.

---

## 📁 Project Structure

```
lib/
  brand.ts          ← Artha brand resolver (getBuilderBrand, extractSubdomain)
  prisma/client.ts  ← Lazy Prisma singleton (demo-safe)
  supabase/         ← Supabase client/server helpers
middleware.ts       ← Subdomain extraction + Supabase auth guard
prisma/
  schema.prisma     ← Data models (Builder, Project, Investor, Investment…)
  migrations/       ← SQL migration history
  seed.ts           ← Demo seed data (Shiva Estate / Sankhedi / Pinaki / Salaiya)
app/
  (auth)/           ← Login pages
  (investor)/       ← Investor-facing portal
  (builder)/        ← Builder admin portal
  api/              ← AI endpoints (return predictor, update generator, classify)
```
