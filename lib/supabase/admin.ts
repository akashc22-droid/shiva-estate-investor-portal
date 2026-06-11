import { createClient } from '@supabase/supabase-js'

/**
 * lib/supabase/admin.ts — service-role client (SERVER ONLY).
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS and can manage auth
 * users. NEVER import this into a client component. Used for account deletion
 * (Play Store requirement) and other privileged server actions.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isAdminConfigured = !!url && !!serviceKey

export function createAdminClient() {
    if (!url || !serviceKey) {
        throw new Error('Supabase admin not configured (missing SUPABASE_SERVICE_ROLE_KEY)')
    }
    return createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
}
