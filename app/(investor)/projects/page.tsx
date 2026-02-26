import { prisma } from '@/lib/prisma/client'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AmountDisplay } from '@/components/shared/AmountDisplay'

async function getProjects() {
    try {
        return await prisma.project.findMany({
            include: {
                investments: {
                    include: { unit: true }
                },
                milestones: { orderBy: { order: 'asc' }, take: 1, where: { status: 'IN_PROGRESS' } },
            },
            orderBy: { overallProgress: 'desc' },
        })
    } catch {
        return []
    }
}

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="max-w-3xl mx-auto px-5 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-display text-2xl font-bold text-text-primary">My Projects</h1>
                <p className="text-text-muted text-sm mt-1">{projects.length > 0 ? projects.length : 3} active investments</p>
            </div>

            <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(projects.length > 0 ? projects : DEMO_PROJECTS).map((project: any) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="card p-5 hover:border-surface-hover transition-all group cursor-pointer">
                            {/* Project status bar */}
                            <div className="h-1 w-full rounded-full mb-4 overflow-hidden bg-surface-border">
                                <div
                                    className="h-full bg-gold-gradient rounded-full transition-all"
                                    style={{ width: `${project.overallProgress}%` }}
                                />
                            </div>

                            <div className="flex items-start gap-4">
                                <ProgressRing
                                    progress={project.overallProgress}
                                    size={64}
                                    strokeWidth={5}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h2 className="text-text-primary font-semibold group-hover:text-brand-accent transition-colors">
                                            {project.name}
                                        </h2>
                                        <StatusBadge label={project.status} />
                                    </div>

                                    <p className="text-text-muted text-xs flex items-center gap-1 mb-3">
                                        <MapPin size={11} />
                                        {project.location}, {project.city}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-text-muted text-[10px]">Project Value</p>
                                            <p className="text-text-primary font-mono text-sm font-semibold">
                                                ₹{project.totalProjectValue} Cr
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-text-muted text-[10px]">Units</p>
                                            <p className="text-text-primary font-mono text-sm font-semibold">
                                                {project.totalUnits}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-text-muted text-[10px]">RERA</p>
                                            <p className="text-brand-accent text-[10px] font-mono truncate">
                                                {project.reraNumber ?? 'Registered'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* In-progress milestone */}
                                    {project.milestones && project.milestones.length > 0 && (
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-status-amber">
                                            <span className="w-1.5 h-1.5 rounded-full bg-status-amber animate-pulse" />
                                            In progress: {project.milestones[0].name}
                                        </div>
                                    )}
                                </div>
                                <ChevronRight size={18} className="text-text-muted flex-shrink-0 group-hover:text-brand-accent transition-colors" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

const DEMO_PROJECTS = [
    {
        id: 'demo-sankhedi',
        name: 'Sankhedi Project',
        location: 'Kolar Road, Near SAGE International School',
        city: 'Bhopal',
        overallProgress: 55,
        status: 'UNDER_CONSTRUCTION',
        totalProjectValue: 45,
        totalUnits: 48,
        reraNumber: 'P4500012345',
        milestones: [{ name: 'Ground Floor Slab & Plinth Work' }],
    },
    {
        id: 'demo-pinaki',
        name: 'Pinaki Home',
        location: 'Area Banjari, Kolar',
        city: 'Bhopal',
        overallProgress: 92,
        status: 'NEAR_COMPLETION',
        totalProjectValue: 28,
        totalUnits: 72,
        reraNumber: 'P4500067890',
        milestones: [{ name: 'Finishing & Fitouts' }],
    },
    {
        id: 'demo-salaiya',
        name: 'Salaiya Project',
        location: 'Salaiya, Near Rajiv Gandhi College',
        city: 'Bhopal',
        overallProgress: 0,
        status: 'UPCOMING',
        totalProjectValue: 38,
        totalUnits: 64,
        reraNumber: null,
        milestones: [],
    },
]
