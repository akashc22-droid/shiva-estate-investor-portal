import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { TrendingUp, Users, Building2, AlertCircle, ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ProgressRing } from '@/components/shared/ProgressRing'

async function getBuilderStats() {
    try {
        const [projects, investors, investments] = await Promise.all([
            prisma.project.findMany({ where: { status: { not: 'COMPLETED' } } }),
            prisma.investor.findMany(),
            prisma.investment.findMany({ include: { project: true } }),
        ])
        const totalFunds = projects.reduce((sum, p) => sum + p.fundingRaised, 0)
        return { projects, investors, investments, totalFunds }
    } catch {
        return { projects: DEMO_PROJECTS, investors: Array(5), investments: Array(5), totalFunds: 538 }
    }
}

export default async function BuilderDashboardPage() {
    const { projects, investors, investments, totalFunds } = await getBuilderStats()

    const stats = [
        { label: 'Active Projects', value: projects.length.toString(), icon: Building2, color: 'text-brand-accent' },
        { label: 'Total Investors', value: investors.length.toString(), icon: Users, color: 'text-status-blue' },
        { label: 'Funds Raised', value: `₹${typeof totalFunds === 'number' ? totalFunds.toFixed(0) : 538} Cr`, icon: TrendingUp, color: 'text-status-green' },
        { label: 'Pending Payments', value: '3', icon: AlertCircle, color: 'text-status-amber' },
    ]

    return (
        <div className="max-w-5xl mx-auto px-5 py-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">Builder Dashboard</h1>
                <p className="text-text-muted text-sm mt-1">ShivaOS Realty — Admin Overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon size={16} className={stat.color} />
                            <p className="text-text-muted text-xs">{stat.label}</p>
                        </div>
                        <p className={`font-mono font-bold text-2xl ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Projects overview */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-text-primary font-semibold">Projects</h2>
                    <Link href="/builder/projects" className="text-brand-accent text-xs flex items-center gap-1">
                        Manage all <ChevronRight size={12} />
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {DEMO_PROJECTS.map((project) => (
                        <Link key={project.id} href={`/builder/projects/${project.id}`}>
                            <div className="card p-4 hover:border-brand-accent/20 transition-colors group cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                    <ProgressRing progress={project.overallProgress} size={44} strokeWidth={4} />
                                    <StatusBadge label={project.status} />
                                </div>
                                <h3 className="text-text-primary font-semibold text-sm group-hover:text-brand-accent transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-text-muted text-xs mt-0.5">{project.city}</p>
                                <div className="flex items-center justify-between mt-3 text-xs">
                                    <span className="text-text-secondary">{project.totalUnits} units</span>
                                    <span className="text-brand-accent font-mono">₹{project.totalProjectValue} Cr</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent activity */}
            <div>
                <h2 className="text-text-primary font-semibold mb-3">Recent Activity</h2>
                <div className="card divide-y divide-surface-border">
                    {DEMO_ACTIVITY.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 p-4">
                            <span className="text-lg">{a.icon}</span>
                            <div className="flex-1">
                                <p className="text-text-primary text-sm">{a.title}</p>
                                <p className="text-text-muted text-xs">{a.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const DEMO_PROJECTS = [
    { id: 'demo-skyline', name: 'ShivaOS Skyline', city: 'Hyderabad', overallProgress: 68, status: 'UNDER_CONSTRUCTION', totalUnits: 280, totalProjectValue: 480 },
    { id: 'demo-gardens', name: 'ShivaOS Gardens', city: 'Hyderabad', overallProgress: 92, status: 'NEAR_COMPLETION', totalUnits: 160, totalProjectValue: 220 },
    { id: 'demo-horizon', name: 'ShivaOS Horizon', city: 'Hyderabad', overallProgress: 0, status: 'UPCOMING', totalUnits: 400, totalProjectValue: 620 },
]

const DEMO_ACTIVITY = [
    { icon: '💰', title: 'Rajesh Sharma — payment due ₹20L on 28 Feb', time: '2 days ago' },
    { icon: '🏗️', title: 'Progress update published — Skyline Feb 2026', time: '12 days ago' },
    { icon: '✅', title: 'RERA Q3 filing completed — Score 94/100', time: '42 days ago' },
    { icon: '👤', title: 'New investor registered — Arjun Kapoor (Horizon)', time: '52 days ago' },
]
