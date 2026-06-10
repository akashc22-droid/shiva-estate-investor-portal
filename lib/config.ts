/**
 * lib/config.ts — global runtime configuration.
 *
 * DEMO_MODE is FAIL-CLOSED. It is only ON when NEXT_PUBLIC_DEMO_MODE is the
 * exact string "true". Anything else — unset, empty, "false", a typo, or a
 * missing-env misconfiguration on a production deploy — leaves it OFF.
 *
 * Why this matters: previously the app fell into demo mode (auth skipped,
 * "any OTP works") whenever Supabase env vars were absent — i.e. it failed
 * OPEN. A single missing var on production turned the whole portal into an
 * open backdoor over real investor data. With this flag, demo mode is
 * something you opt INTO for pitches; production never falls into it by
 * accident.
 *
 * Set NEXT_PUBLIC_DEMO_MODE=true only on pitch/preview deployments and in
 * local .env.local. Leave it unset on the production environment.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
