'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, CheckCircle, Clock, AlertCircle, Download, ExternalLink, FileText, Image } from 'lucide-react'
import Link from 'next/link'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AmountDisplay } from '@/components/shared/AmountDisplay'
import { AIInsightCard } from '@/components/shared/AIInsightCard'
import { formatDate, formatINR } from '@/lib/utils/format'

const TABS = ['Overview', 'Progress', 'Investment', 'Documents', 'AI Returns']

const DOCUMENT_TYPE_ICONS: Record<string, string> = {
    ALLOTMENT_LETTER: '📋',
    SALE_AGREEMENT: '📄',
    PAYMENT_RECEIPT: '🧾',
    DEMAND_NOTICE: '⚠️',
    OC_CERTIFICATE: '🏛️',
    CC_CERTIFICATE: '🏗️',
    RERA_REGISTRATION: '🔖',
    FLOOR_PLAN: '🗺️',
    BROCHURE: '📰',
    NOC: '✅',
    POSSESSION_LETTER: '🏠',
    OTHER: '📁',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProjectDetailClient({ project }: { project: any }) {
    const [activeTab, setActiveTab] = useState(0)

    const investment = project.investments?.[0]
    const paymentPlan = investment?.paymentPlan
        ? JSON.parse(investment.paymentPlan)
        : []

    const completedMilestones = project.milestones?.filter(
        (m: { status: string }) => m.status === 'COMPLETED'
    ).length ?? 0

    return (
        <div className="min-h-screen pb-10">
            {/* Hero header */}
            <div className="relative bg-surface-card border-b border-surface-border">
                <div
                    className="h-48 w-full relative flex items-end"
                    style={{
                        background: 'linear-gradient(180deg, #1A1A2E 0%, #0F0F1A 100%)',
                    }}
                >
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 75% 50%, #C9A84C 0%, transparent 50%)',
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="font-display text-6xl font-bold text-surface-border select-none">
                            {project.overallProgress}%
                        </p>
                    </div>
                    <div className="absolute top-4 left-4">
                        <Link href="/projects">
                            <button className="w-9 h-9 rounded-xl bg-surface-dark/60 backdrop-blur border border-surface-border flex items-center justify-center">
                                <ArrowLeft size={16} className="text-text-secondary" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h1 className="font-display text-xl font-bold text-text-primary">{project.name}</h1>
                            <p className="text-text-muted text-sm flex items-center gap-1 mt-0.5">
                                <MapPin size={12} />
                                {project.location}, {project.city}
                            </p>
                            {project.reraNumber && (
                                <p className="text-brand-accent text-xs font-mono mt-0.5">
                                    RERA: {project.reraNumber}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <StatusBadge label={project.status} />
                            <ProgressRing progress={project.overallProgress} size={52} strokeWidth={4} />
                        </div>
                    </div>
                </div>

                {/* Tab bar */}
                <div className="flex border-t border-surface-border overflow-x-auto no-scrollbar">
                    {TABS.map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(i)}
                            className={`relative flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${activeTab === i
                                    ? 'text-brand-accent'
                                    : 'text-text-muted hover:text-text-secondary'
                                }`}
                        >
                            {tab}
                            {activeTab === i && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="max-w-3xl mx-auto px-5 py-6">
                <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="card p-4">
                                    <p className="text-text-muted text-xs mb-1">Total Units</p>
                                    <p className="font-mono font-bold text-xl text-text-primary">{project.totalUnits}</p>
                                    <p className="text-text-muted text-xs">{project.projectType?.toLowerCase()}</p>
                                </div>
                                <div className="card p-4">
                                    <p className="text-text-muted text-xs mb-1">Project Value</p>
                                    <p className="font-mono font-bold text-xl text-text-primary">₹{project.totalProjectValue} Cr</p>
                                    <p className="text-text-muted text-xs">total</p>
                                </div>
                                <div className="card p-4">
                                    <p className="text-text-muted text-xs mb-1">Expected Completion</p>
                                    <p className="font-semibold text-text-primary text-sm">
                                        {project.expectedCompletion ? formatDate(project.expectedCompletion) : 'TBD'}
                                    </p>
                                    {project.status === 'DELAYED' && (
                                        <p className="text-status-red text-xs mt-0.5">Delayed</p>
                                    )}
                                </div>
                                <div className="card p-4">
                                    <p className="text-text-muted text-xs mb-1">Funding Raised</p>
                                    <p className="font-mono font-bold text-text-primary text-sm">₹{project.fundingRaised} Cr</p>
                                    <div className="h-1 bg-surface-border rounded-full mt-1.5">
                                        <div
                                            className="h-full bg-status-green rounded-full"
                                            style={{ width: `${(project.fundingRaised / project.totalFundingTarget) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {project.description && (
                                <div className="card p-4">
                                    <h3 className="text-text-primary font-medium mb-2">About Project</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
                                </div>
                            )}

                            {/* Location */}
                            <div className="card p-4">
                                <h3 className="text-text-primary font-medium mb-2">Location</h3>
                                <div className="bg-surface-dark rounded-xl h-32 flex items-center justify-center border border-surface-border">
                                    <div className="text-center">
                                        <MapPin size={24} className="text-brand-accent mx-auto mb-1" />
                                        <p className="text-text-secondary text-sm">{project.location}</p>
                                        <p className="text-text-muted text-xs">{project.city}, {project.state}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 1 && (
                        <motion.div
                            key="progress"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {/* Overall progress */}
                            <div className="card p-5 flex items-center gap-5">
                                <ProgressRing progress={project.overallProgress} size={80} strokeWidth={7} />
                                <div>
                                    <h3 className="text-text-primary font-semibold">Overall Progress</h3>
                                    <p className="text-text-muted text-sm mt-0.5">
                                        {completedMilestones} of {project.milestones?.length ?? 0} milestones complete
                                    </p>
                                    {project.expectedCompletion && (
                                        <p className="text-brand-accent text-xs mt-1">
                                            Target: {formatDate(project.expectedCompletion)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* RERA Compliance Badge */}
                            <div className="card p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-status-green/10 flex items-center justify-center">
                                        <CheckCircle size={18} className="text-status-green" />
                                    </div>
                                    <div>
                                        <p className="text-text-primary font-medium text-sm">RERA Compliant</p>
                                        <p className="text-text-muted text-xs">Score: 94/100</p>
                                    </div>
                                </div>
                                <span className="text-brand-accent text-xs font-mono">{project.reraNumber}</span>
                            </div>

                            {/* Milestone Timeline */}
                            <div className="card p-5">
                                <h3 className="text-text-primary font-semibold mb-4">Construction Timeline</h3>
                                <div className="relative">
                                    {(project.milestones ?? []).map((milestone: {
                                        id: string;
                                        name: string;
                                        status: string;
                                        progress: number;
                                        actualDate: Date | null;
                                        targetDate: Date;
                                        description?: string | null;
                                        order: number;
                                    }, idx: number) => {
                                        const isLast = idx === (project.milestones?.length ?? 0) - 1
                                        const StatusIcon =
                                            milestone.status === 'COMPLETED' ? CheckCircle
                                                : milestone.status === 'IN_PROGRESS' ? Clock
                                                    : AlertCircle

                                        const iconColor =
                                            milestone.status === 'COMPLETED' ? 'text-status-green'
                                                : milestone.status === 'IN_PROGRESS' ? 'text-status-amber'
                                                    : 'text-text-muted'

                                        const borderColor =
                                            milestone.status === 'COMPLETED' ? 'border-status-green'
                                                : milestone.status === 'IN_PROGRESS' ? 'border-status-amber'
                                                    : 'border-surface-border'

                                        return (
                                            <div key={milestone.id} className="flex gap-4">
                                                {/* Timeline line */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full border-2 ${borderColor} flex items-center justify-center bg-surface-card flex-shrink-0`}>
                                                        <StatusIcon size={14} className={iconColor} />
                                                    </div>
                                                    {!isLast && (
                                                        <div className={`w-0.5 flex-1 min-h-4 my-1 ${milestone.status === 'COMPLETED' ? 'bg-status-green/30' : 'bg-surface-border'}`} />
                                                    )}
                                                </div>
                                                {/* Content */}
                                                <div className="pb-5 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`font-medium text-sm ${milestone.status === 'COMPLETED' ? 'text-text-primary' : milestone.status === 'IN_PROGRESS' ? 'text-status-amber' : 'text-text-muted'}`}>
                                                            {milestone.name}
                                                        </p>
                                                        <p className="text-text-muted text-xs flex-shrink-0">
                                                            {milestone.actualDate
                                                                ? formatDate(milestone.actualDate)
                                                                : formatDate(milestone.targetDate)}
                                                        </p>
                                                    </div>
                                                    {milestone.description && (
                                                        <p className="text-text-muted text-xs mt-1">{milestone.description}</p>
                                                    )}
                                                    {milestone.status === 'IN_PROGRESS' && milestone.progress > 0 && (
                                                        <div className="mt-2">
                                                            <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-status-amber rounded-full"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${milestone.progress}%` }}
                                                                    transition={{ delay: 0.3, duration: 0.8 }}
                                                                />
                                                            </div>
                                                            <p className="text-status-amber text-[10px] mt-1">{milestone.progress}% complete</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 2 && (
                        <motion.div
                            key="investment"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {investment ? (
                                <>
                                    {/* Investment summary */}
                                    <div className="card p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-text-muted text-xs">Your Unit</p>
                                                <p className="text-text-primary font-bold text-lg font-mono">
                                                    {investment.unit?.unitNumber}
                                                </p>
                                                <p className="text-text-muted text-sm">
                                                    {investment.unit?.type} · {investment.unit?.carpetArea} sqft
                                                </p>
                                            </div>
                                            <StatusBadge label={investment.status} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-text-muted text-xs">Agreed Amount</p>
                                                <AmountDisplay amount={investment.totalAgreedAmount} compact size="lg" />
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs">Total Paid</p>
                                                <AmountDisplay amount={investment.totalPaid} compact size="lg" className="text-status-green" />
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs">Pending</p>
                                                <AmountDisplay amount={investment.pendingAmount} compact size="md" className="text-status-amber" />
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs">Possession</p>
                                                <p className="font-medium text-text-primary text-sm">
                                                    {investment.possessionDate ? formatDate(investment.possessionDate) : 'TBD'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Payment progress bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-text-muted mb-1">
                                                <span>Payment Progress</span>
                                                <span>{Math.round((investment.totalPaid / investment.totalAgreedAmount) * 100)}%</span>
                                            </div>
                                            <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-brand-accent rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(investment.totalPaid / investment.totalAgreedAmount) * 100}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Schedule */}
                                    <div className="card p-5">
                                        <h3 className="text-text-primary font-semibold mb-4">Payment Schedule</h3>
                                        <div className="space-y-2">
                                            {paymentPlan.map((p: {
                                                milestone: string;
                                                amount: number;
                                                dueDate: string;
                                                status: string;
                                            }, i: number) => (
                                                <div key={i} className={`flex items-center justify-between py-2.5 px-3 rounded-xl border ${p.status === 'PAID' ? 'border-status-green/20 bg-status-green/5'
                                                        : p.status === 'DUE' ? 'border-status-amber/30 bg-status-amber/5'
                                                            : 'border-surface-border bg-surface-dark'
                                                    }`}>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${p.status === 'PAID' ? 'text-text-secondary' : 'text-text-primary'}`}>
                                                            {p.milestone}
                                                        </p>
                                                        <p className="text-text-muted text-xs mt-0.5">
                                                            {p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <AmountDisplay amount={p.amount} compact size="sm" />
                                                        {p.status === 'PAID' ? (
                                                            <CheckCircle size={16} className="text-status-green flex-shrink-0" />
                                                        ) : p.status === 'DUE' ? (
                                                            <button className="text-[10px] bg-status-amber text-surface-dark font-bold px-2 py-0.5 rounded-lg">
                                                                Pay Now
                                                            </button>
                                                        ) : (
                                                            <Clock size={16} className="text-text-muted flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {investment.agreementNumber && (
                                            <p className="mt-3 text-text-muted text-xs">
                                                Agreement: {investment.agreementNumber}
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="card p-8 text-center">
                                    <p className="text-text-muted">No investment found for this project.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 3 && (
                        <motion.div
                            key="documents"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-text-primary font-semibold">Project Documents</h3>
                                <Link href="/documents" className="text-brand-accent text-xs">View all →</Link>
                            </div>
                            {(project.documents ?? []).map((doc: {
                                id: string;
                                name: string;
                                documentType: string;
                                fileUrl: string;
                                fileSize?: number | null;
                                createdAt: Date;
                            }) => (
                                <div key={doc.id} className="card p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-surface-dark flex items-center justify-center text-lg flex-shrink-0">
                                        {DOCUMENT_TYPE_ICONS[doc.documentType] ?? '📁'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-text-primary text-sm font-medium truncate">{doc.name}</p>
                                        <p className="text-text-muted text-xs">
                                            {doc.documentType.replace(/_/g, ' ')} · {doc.fileSize ? `${(doc.fileSize / 1000).toFixed(0)} KB` : ''}
                                        </p>
                                    </div>
                                    <button className="w-8 h-8 rounded-lg bg-surface-dark flex items-center justify-center hover:bg-brand-accent/10 transition-colors">
                                        <Download size={14} className="text-text-secondary" />
                                    </button>
                                </div>
                            ))}
                            {project.documents?.length === 0 && (
                                <div className="card p-8 text-center">
                                    <FileText size={32} className="text-text-muted mx-auto mb-2" />
                                    <p className="text-text-muted text-sm">No documents yet</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 4 && (
                        <motion.div
                            key="ai-returns"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {investment ? (
                                <>
                                    {/* Return summary */}
                                    <div className="card p-5">
                                        <div className="grid grid-cols-2 gap-4 mb-5">
                                            <div>
                                                <p className="text-text-muted text-xs mb-1">Your Investment</p>
                                                <AmountDisplay amount={investment.totalAgreedAmount} compact size="lg" />
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs mb-1">Projected Return</p>
                                                <p className="font-mono font-bold text-xl text-status-green">
                                                    {investment.predictedReturnRange ?? '15-22%'}
                                                </p>
                                                <p className="text-status-green text-xs">IRR</p>
                                            </div>
                                        </div>
                                        {investment.confidenceScore && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-status-green rounded-full"
                                                        style={{ width: `${investment.confidenceScore * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-text-muted text-xs">
                                                    {Math.round(investment.confidenceScore * 100)}% confidence
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <AIInsightCard
                                        title={`AI Analysis — ${project.name}`}
                                        content={`Based on analysis of 47 registered transactions in the Kokapet micro-market over the last 18 months, comparable ${investment.unit?.type ?? '2BHK'} units in luxury projects have appreciated at 8.2% annually. ShivaOS Skyline's on-time construction trajectory and RERA compliance score of 94% position it in the top quartile for this corridor. Projected value at possession: ₹${Math.round(investment.totalAgreedAmount * 1.2 / 100000)}L–₹${Math.round(investment.totalAgreedAmount * 1.28 / 100000)}L.`}
                                        confidence={investment.confidenceScore ?? 0.82}
                                        lastUpdated="14 Feb 2026"
                                        variant="prediction"
                                    />

                                    <div className="text-center">
                                        <Link
                                            href="/returns"
                                            className="inline-flex items-center gap-2 text-brand-accent text-sm border border-brand-accent/30 px-4 py-2 rounded-xl hover:bg-brand-accent/10 transition-colors"
                                        >
                                            Full Return Analysis
                                            <ExternalLink size={13} />
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="card p-8 text-center">
                                    <p className="text-text-muted">No investment data available.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
