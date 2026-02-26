import { prisma } from '@/lib/prisma/client'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

// Demo investor ID — in production read from Supabase session

async function getInvestorData() {
    try {
        // Get first investor for demo (replace with session-based lookup)
        const investor = await prisma.investor.findFirst({
            where: { name: 'Rajesh Sharma' },
            include: {
                investments: {
                    include: {
                        project: true,
                        unit: true,
                        payments: { orderBy: { paidAt: 'desc' } },
                    },
                },
            },
        })
        return investor
    } catch {
        return null
    }
}

async function getRecentUpdates() {
    try {
        return await prisma.projectUpdate.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
            take: 3,
            include: { project: { select: { name: true } } },
        })
    } catch {
        return []
    }
}

async function getNotifications(investorId: string) {
    try {
        return await prisma.notification.findMany({
            where: { investorId, isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 5,
        })
    } catch {
        return []
    }
}

export default async function DashboardPage() {
    const investor = await getInvestorData()
    const updates = await getRecentUpdates()
    const notifications = investor ? await getNotifications(investor.id) : []

    return (
        <DashboardClient
            investor={investor}
            updates={updates}
            notifications={notifications}
        />
    )
}
