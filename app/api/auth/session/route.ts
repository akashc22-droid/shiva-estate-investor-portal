import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()
    return NextResponse.json({ authenticated: !!session, userId: session?.user?.id ?? null })
}

export async function POST(request: NextRequest) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
            },
        }
    )

    const { action } = await request.json()

    if (action === 'logout') {
        await supabase.auth.signOut()
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
