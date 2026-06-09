import { createBrowserClient } from '@supabase/ssr'

const DEMO_URL = 'https://demo.supabase.co'
const DEMO_KEY = 'demo-key-placeholder'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * True only when real Supabase credentials are present.
 *
 * On the demo / pitch deployment (Vercel without env vars) this is `false`,
 * so the login pages run a self-contained demo flow instead of making network
 * calls to a non-existent Supabase project. Without this guard, the auth SDK
 * fires real requests against the `demo.supabase.co` placeholder and returns a
 * cryptic error — the user can never get past the login screen.
 */
export const isSupabaseConfigured =
  !!url && !!key && url !== DEMO_URL && key !== DEMO_KEY && /^https?:\/\//.test(url)

export function createClient() {
  return createBrowserClient(url ?? DEMO_URL, key ?? DEMO_KEY)
}
