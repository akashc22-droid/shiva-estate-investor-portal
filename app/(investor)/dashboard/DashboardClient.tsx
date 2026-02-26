'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    TrendingUp, CreditCard, FileText, Camera, Bell,
    MessageCircle, ChevronRight, MapPin, Globe
} from 'lucide-react'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { AIInsightCard } from '@/components/shared/AIInsightCard'
import { AmountDisplay } from '@/components/shared/AmountDisplay'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, formatINR } from '@/lib/utils/format'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardClient({ investor, updates, notifications }: any) {
    const stagger = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    }
    const item = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    }

    // Calculated portfolio stats
    const totalInvested = investor?.investments?.reduce(
        (sum: number, inv: { totalPaid: number }) => sum + inv.totalPaid, 0
    ) ?? 7500000

    const avgReturn = investor?.investments?.[0]?.predictedReturnPct ?? 16.5
    const projectedGain = totalInvested * (avgReturn / 100)

    // Next payment due (from payment plan JSON)
    const nextPayment = (() => {
        const inv = investor?.investments?.[0]
        if (!inv?.paymentPlan) return { amount: 950000, date: '28 Feb 2026' }
        const plan = JSON.parse(inv.paymentPlan)
        const due = plan.find((p: { status: string }) => p.status === 'DUE')
        return due ? { amount: due.amount, date: due.dueDate } : null
    })()

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-surface-dark/80 backdrop-blur-xl border-b border-surface-border px-5 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-text-muted text-xs">Welcome back,</p>
                        <h1 className="text-text-primary font-semibold text-lg leading-tight">
                            {investor?.name ?? 'Rajesh Sharma'}
                            {investor?.isNRI && (
                                <span className="ml-2 text-xs text-brand-accent font-normal align-middle">
                                    <Globe size={11} className="inline mr-0.5" />NRI
                                </span>
                            )}
                        </h1>
                    </div>
                    <Link href="/notifications" className="relative">
                        <div className="w-9 h-9 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
                            <Bell size={17} className="text-text-secondary" />
                        </div>
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-red text-white text-[9px] flex items-center justify-center font-bold">
                                {notifications.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
                <motion.div variants={stagger} initial="hidden" animate="show">

                    {/* Portfolio Overview Card */}
                    <motion.div variants={item}>
                        <div className="rounded-2xl p-6 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(145deg, #1A1A2E 0%, #16162A 50%, #1A1A2E 100%)',
                                border: '1px solid #2A2A4A',
                                boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.05)',
                            }}
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />

                            <div className="relative grid grid-cols-2 gap-6 mb-5">
                                <div>
                                    <p className="text-text-muted text-xs mb-1">Total Invested</p>
                                    <AmountDisplay amount={totalInvested} size="xl" compact />
                                    <p className="text-text-muted text-xs mt-1">across {investor?.investments?.length ?? 1} project</p>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs mb-1">Projected Returns</p>
                                    <p className="font-mono font-bold text-3xl text-status-green">{avgReturn}%</p>
                                    <p className="text-text-muted text-xs mt-1">
                                        <AmountDisplay amount={projectedGain} compact size="sm" className="text-status-green" /> projected gain
                                    </p>
                                </div>
                            </div>

                            {/* Portfolio health bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-text-muted text-xs">Portfolio Health</p>
                                    <p className="text-status-green text-xs font-medium">Excellent</p>
                                </div>
                                <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gold-gradient rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: '82%' }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />
                                </div>
                            </div>

                            {/* Next payment due */}
                            {nextPayment && (
                                <div className="bg-status-amber/5 border border-status-amber/20 rounded-xl px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-status-amber text-xs font-medium">⚠️ Next Payment Due</p>
                                            <p className="text-text-primary text-sm font-semibold mt-0.5">
                                                <AmountDisplay amount={nextPayment.amount} compact />
                                                <span className="text-text-muted font-normal ml-2 text-xs">
                                                    on {typeof nextPayment.date === 'string' && nextPayment.date.includes('-')
                                                        ? new Date(nextPayment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : nextPayment.date}
                                                </span>
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-status-amber" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* AI Insight Card */}
                    <motion.div variants={item}>
                        <AIInsightCard
                            title="AI Insight — Updated Feb 2026"
                            content={`Based on 28 comparable transactions on Kolar Road and Banjari corridor, residential plots have appreciated 14–18% YoY. Sankhedi Project's location near SAGE International School commands a premium micro-market position. Pinaki Home (72 flats & plots, Banjari Kolar) is approaching near-completion, with excellent rental demand from the student and IT corridor. RERA compliance positions both projects in the top quartile for Bhopal residential.`}
                            confidence={0.82}
                            lastUpdated="26 Feb 2026"
                        />
                    </motion.div>

                    {/* My Projects */}
                    <motion.div variants={item}>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-text-primary font-semibold">My Projects</h2>
                            <Link href="/projects" className="text-brand-accent text-xs flex items-center gap-1">
                                View all <ChevronRight size={12} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {(investor?.investments ?? DEMO_INVESTMENTS).map((inv: DemoInvestment, idx: number) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.01 }}
                                    className="card p-4 cursor-pointer active:scale-[0.99] transition-transform"
                                >
                                    <Link href={`/projects/${inv.project?.id ?? inv.projectId ?? 'demo-sankhedi'}`}>
                                        <div className="flex items-start gap-4">
                                            <ProgressRing
                                                progress={inv.project?.overallProgress ?? 55}
                                                size={56}
                                                strokeWidth={5}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="text-text-primary font-medium text-sm leading-snug">
                                                            {inv.project?.name ?? 'Sankhedi Project'}
                                                        </h3>
                                                        <p className="text-text-muted text-xs flex items-center gap-1 mt-0.5">
                                                            <MapPin size={10} />
                                                            {inv.project?.city ?? 'Kolar Road, Bhopal'}
                                                        </p>
                                                    </div>
                                                    <StatusBadge label={inv.project?.status ?? 'UNDER_CONSTRUCTION'} />
                                                </div>

                                                <div className="mt-2">
                                                    <p className="text-text-muted text-xs mb-1">
                                                        Plot {inv.unit?.unitNumber ?? 'SP-07'} · {inv.unit?.type ?? 'Residential Plot'} · {inv.unit?.carpetArea ?? 1800} sqft
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-brand-accent rounded-full"
                                                                style={{
                                                                    width: `${((inv.totalPaid ?? 4500000) / (inv.totalAgreedAmount ?? 7500000)) * 100}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="text-text-muted text-[10px] whitespace-nowrap">
                                                            {formatINR(inv.totalPaid ?? 4500000, true)} / {formatINR(inv.totalAgreedAmount ?? 7500000, true)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Updates */}
                    {updates?.length > 0 && (
                        <motion.div variants={item}>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-text-primary font-semibold">Recent Updates</h2>
                            </div>
                            <div className="space-y-3">
                                {updates.map((update: {
                                    id: string;
                                    title: string;
                                    body: string;
                                    updateType: string;
                                    publishedAt: Date | null;
                                    project?: { name: string };
                                }) => (
                                    <div key={update.id} className="card p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs">🏗️</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-text-primary text-sm font-medium leading-snug">{update.title}</p>
                                                <p className="text-text-muted text-xs mt-1">{update.project?.name}</p>
                                                <p className="text-text-secondary text-xs mt-1.5 line-clamp-2">
                                                    {update.body.replace(/\*\*/g, '').slice(0, 120)}...
                                                </p>
                                                <p className="text-text-muted text-[10px] mt-2">
                                                    {update.publishedAt ? formatDate(update.publishedAt) : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Actions */}
                    <motion.div variants={item}>
                        <h2 className="text-text-primary font-semibold mb-3">Quick Actions</h2>
                        <div className="grid grid-cols-4 gap-3">
                            {QUICK_ACTIONS.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="card p-3 flex flex-col items-center gap-2 text-center hover:border-brand-accent/30 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-surface-dark flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                                        <action.icon size={17} className="text-text-secondary group-hover:text-brand-accent transition-colors" />
                                    </div>
                                    <span className="text-text-muted text-[10px] leading-tight">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

type DemoInvestment = {
    project?: { id?: string; name?: string; city?: string; overallProgress?: number; status?: string };
    projectId?: string;
    unit?: { unitNumber?: string; type?: string; carpetArea?: number };
    totalPaid?: number;
    totalAgreedAmount?: number;
}

const DEMO_INVESTMENTS: DemoInvestment[] = [
    {
        project: {
            id: 'demo-sankhedi',
            name: 'Sankhedi Project',
            city: 'Kolar Road, Bhopal',
            overallProgress: 55,
            status: 'UNDER_CONSTRUCTION',
        },
        unit: { unitNumber: 'SP-07', type: 'Residential Plot', carpetArea: 1800 },
        totalPaid: 4500000,
        totalAgreedAmount: 7500000,
    },
]

const QUICK_ACTIONS = [
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Photos', href: '/projects', icon: Camera },
    { label: 'Payments', href: '/projects', icon: CreditCard },
    { label: 'AI Returns', href: '/returns', icon: TrendingUp },
]
