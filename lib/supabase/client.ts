import { createBrowserClient } from '@supabase/ssr'

const DEMO_URL = 'https://demo.supabase.co'
const DEMO_KEY = 'demo-key-placeholder'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEMO_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? DEMO_KEY

  return createBrowserClient(url, key)
}
