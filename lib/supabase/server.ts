import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Fall back to placeholders so this never throws "supabaseUrl is required" in
// demo mode. Real auth requires NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY to be set.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://demo.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'demo-key-placeholder'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // setAll called from Server Component — middleware handles refresh
                    }
                },
            },
        }
    )
}
