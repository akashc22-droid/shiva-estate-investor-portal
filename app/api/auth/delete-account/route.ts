import { NextResponse } from 'next/server'
import { DEMO_MODE } from '@/lib/config'

/**
 * POST /api/auth/delete-account
 *
 * Permanently deletes the signed-in investor's account and all associated data,
 * then removes their Supabase auth user. Required by Google Play for any app
 * with account creation.
 */
export async function POST() {
    // Demo mode — there is no real account to delete.
    if (DEMO_MODE) {
        return NextResponse.json({
            success: true,
            demo: true,
            message: 'Demo mode — no real account exists, so nothing was deleted.',
        })
    }

    try {
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()

        // Validate the session against the auth server (not just the cookie).
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // ── Delete application data (Prisma) ────────────────────────────────
        const { prisma } = await import('@/lib/prisma/client')
        const investor = await prisma.investor.findUnique({ where: { supabaseId: user.id } })

        if (investor) {
            const investments = await prisma.investment.findMany({
                where: { investorId: investor.id },
                select: { id: true },
            })
            const investmentIds = investments.map((i: { id: string }) => i.id)

            if (investmentIds.length > 0) {
                await prisma.payment.deleteMany({ where: { investmentId: { in: investmentIds } } })
            }
            await prisma.investment.deleteMany({ where: { investorId: investor.id } })
            await prisma.document.deleteMany({ where: { investorId: investor.id } })
            await prisma.notification.deleteMany({ where: { investorId: investor.id } })
            await prisma.investor.delete({ where: { id: investor.id } })
        }

        // ── Delete the Supabase auth user (service role) ────────────────────
        const { createAdminClient } = await import('@/lib/supabase/admin')
        const admin = createAdminClient()
        await admin.auth.admin.deleteUser(user.id)

        // Clear the session cookie.
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Account deletion error:', error)
        return NextResponse.json({ error: 'Failed to delete account. Please contact support.' }, { status: 500 })
    }
}
