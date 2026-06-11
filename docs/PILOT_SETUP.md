# Pilot Setup — Going from Demo Mode to Real Auth

Step-by-step to take the portal from the pitch demo (`NEXT_PUBLIC_DEMO_MODE=true`)
to a real, invite-only pilot for 15 investors. Do steps 1–4 first; step 5 (SMS)
runs in parallel; step 6 is the final flip.

---

## 1. Create the Supabase project

1. Go to <https://supabase.com> → sign in → **New Project**.
2. Name it `shiva-estate-prod` (or similar). Set a strong **database password** and save it in a password manager — you'll need it for the connection string.
3. **Region: choose `Mumbai (ap-south-1)`** — lowest latency for your India users (and acceptable for Dubai NRIs).
4. Wait ~2 minutes for provisioning.

## 2. Collect keys & set them on Vercel

In Supabase → **Project Settings → API**, copy:

| Supabase value | Vercel env var | Scope |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview |
| `service_role` key (secret) | `SUPABASE_SERVICE_ROLE_KEY` | Production only |

In Supabase → **Project Settings → Database → Connection string**:

| | Vercel env var | Notes |
|---|---|---|
| **Transaction pooler** (port 6543) | `DATABASE_URL` | Append `?pgbouncer=true` |
| **Direct** connection (port 5432) | `DIRECT_URL` | Used for migrations |

Then in **Vercel → Project → Settings → Environment Variables**, add each one
(keep your existing `Gemini_API_KEY`).

> ⚠️ `NEXT_PUBLIC_*` vars are baked in **at build time** — they only take effect
> on the next deploy.

## 3. Enable Email provider with a code (token) template

1. Supabase → **Authentication → Providers → Email** → enable it.
2. Supabase → **Authentication → Sign In / Providers → User Signups** → turn
   **OFF** "Allow new users to sign up" (invite-only pilot; our code also sends
   `shouldCreateUser: false`).
3. Supabase → **Authentication → Email Templates → Magic Link** → edit the body
   so it sends the **6-digit code**, not just a link. Include `{{ .Token }}`:

   ```html
   <h2>Your Shiva Estate login code</h2>
   <p>Enter this code in the app to sign in:</p>
   <p style="font-size:28px;font-weight:bold;letter-spacing:4px">{{ .Token }}</p>
   <p>This code expires in 10 minutes.</p>
   ```

   (Our login screen now verifies this code in-app — no link needed.)
4. Supabase → **Authentication → Settings** → set **Email OTP expiry** to `600`
   (10 min) and review rate limits.
5. **SMTP (important):** Supabase's built-in email is heavily rate-limited and
   not meant for production. Configure a custom SMTP provider (Resend, SendGrid,
   or Amazon SES) under **Authentication → Settings → SMTP** for reliable
   delivery — especially to Dubai inboxes.

## 4. Create the schema & seed the 15 investors

Each investor needs **both** a Supabase auth user **and** an `Investor` row whose
`supabaseId` equals that auth user's UUID. Do it in this order, locally, with
`.env.local` pointing at the new Supabase DB:

```bash
# 1. Create all tables in the new DB
pnpm prisma migrate deploy        # or: pnpm prisma db push

# 2. Seed the builder + projects (Shiva Estate base data)
pnpm db:seed

# 3. Create the 15 auth users + linked Investor rows
#    (dedicated script — ask the dev to generate scripts/seed-pilot-investors.ts;
#     it loops the investor list, calls admin.auth.admin.createUser({ email,
#     phone, email_confirm:true }), then upserts Investor with supabaseId = user.id)
pnpm ts-node scripts/seed-pilot-investors.ts
```

You'll need a CSV/list of the 15 investors: **name, email, phone, project, unit,
NRI?**. With that, the seed script is ~30 lines and idempotent.

> Manual alternative for a few users: Supabase → **Authentication → Users → Add
> user** (email), then insert the matching `Investor` row with that user's UUID.

## 5. Start MSG91 DLT registration (parallel — 1–2 weeks)

Phone OTP to Indian numbers legally requires **TRAI DLT** registration. Email OTP
(step 3) covers the pilot meanwhile; this is the week-2–3 upgrade.

1. Register as a **Principal Entity** on a DLT portal (e.g. Jio Vilpower / Airtel
   / Vodafone). Needs company PAN, GST, authorised signatory. ~₹5,900 one-time.
2. Register a **Header / Sender ID** (6 chars, e.g. `SHIVAE`) — ~1–2 days approval.
3. Register an **OTP content template**, e.g.
   `{#var#} is your Shiva Estate login code. Valid 10 minutes.` — ~1–2 days approval.
4. In **MSG91**: create an account, link your DLT Entity ID + Sender ID +
   Template ID, and copy the **MSG91 Auth Key**.
5. Wire it to Supabase via **Authentication → Hooks → Send SMS Hook** (or call
   MSG91's OTP API directly). The login screen's phone path already works once
   the provider delivers the SMS.

## 6. Flip from demo to real auth (the final switch)

When env vars are set, investors are seeded, and email OTP is tested:

1. Vercel → Environment Variables → **delete `NEXT_PUBLIC_DEMO_MODE`** (or set it
   to `false`).
2. **Redeploy** (push any commit, or Vercel → Deployments → Redeploy) — required
   because the flag is build-time.
3. Apply RLS as defense-in-depth: Supabase → **SQL Editor** → run
   [`prisma/rls-policies.sql`](../prisma/rls-policies.sql). (Read its header —
   real per-investor scoping lives in the app query layer, not RLS, because
   Prisma bypasses RLS.)

### Post-flip verification checklist

- [ ] A seeded investor logs in via email OTP and sees **their** data
- [ ] A non-seeded email is **refused** ("not registered for the pilot")
- [ ] Visiting a protected URL while logged out **redirects to /login**
- [ ] The Demo Login panel and "any code works" hint are **gone**
- [ ] `/delete-account` actually deletes a test account
- [ ] AI Return Analysis streams (Gemini key working)
