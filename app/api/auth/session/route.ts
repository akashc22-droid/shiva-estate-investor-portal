import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const DEMO_URL = 'https://demo.supabase.co'
const DEMO_KEY = 'demo-key-placeholder'

const isConfigured =
    !!url && !!key && url !== DEMO_URL && key !== DEMO_KEY && /^https?:\/\//.test(url)

async function getServerClient() {
    const cookieStore = await cookies()
    return createServerClient(url!, key!, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
    })
}

export async function GET() {
    // Demo mode — no auth backend; report unauthenticated without touching Supabase.
    if (!isConfigured) {
        return NextResponse.json({ authenticated: false, userId: null, demo: true })
    }

    const supabase = await getServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    return NextResponse.json({ authenticated: !!session, userId: session?.user?.id ?? null })
}

export async function POST(request: NextRequest) {
    const { action } = await request.json()

    if (action === 'logout') {
        // Demo mode has no session to clear — succeed silently.
        if (isConfigured) {
            const supabase = await getServerClient()
            await supabase.auth.signOut()
        }
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
