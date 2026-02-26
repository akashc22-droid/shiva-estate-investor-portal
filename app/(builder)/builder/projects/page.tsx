'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Bot, Loader2, ImageIcon, Send, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { StatusBadge } from '@/components/shared/StatusBadge'

const DEMO_PROJECTS = [
    { id: 'demo-skyline', name: 'ShivaOS Skyline', city: 'Hyderabad', progress: 68, status: 'UNDER_CONSTRUCTION', investors: 38, units: 280 },
    { id: 'demo-gardens', name: 'ShivaOS Gardens', city: 'Hyderabad', progress: 92, status: 'NEAR_COMPLETION', investors: 42, units: 160 },
    { id: 'demo-horizon', name: 'ShivaOS Horizon', city: 'Hyderabad', progress: 0, status: 'UPCOMING', investors: 1, units: 400 },
]

const UPDATE_TYPES = ['CONSTRUCTION', 'RERA_COMPLIANCE', 'FINANCIAL', 'LEGAL', 'POSSESSION', 'GENERAL']

const AI_DRAFT = `We are pleased to share the latest construction update for ShivaOS Skyline as of February 2026.

**Overall Progress: 68%** — Tower A has successfully reached the 19th floor slab, while Tower B is progressing steadily at the 16th floor. Our quality team has endorsed all completed floors with zero Non-Conformance Reports.

MEP (Mechanical, Electrical & Plumbing) rough-in work is running in parallel on floors 1–12 of Tower A, keeping us well ahead of the finishing schedule.

**Next Milestone**: Completion of slabs up to the 20th floor (Tower A) is targeted by **15 March 2026**.

Possession remains on track for **March 2026**. Thank you for your continued trust in ShivaOS Realty.`

export default function BuilderProjectsPage() {
    const [showComposer, setShowComposer] = useState(false)
    const [selectedProject, setSelectedProject] = useState(DEMO_PROJECTS[0])
    const [updateTitle, setUpdateTitle] = useState('')
    const [updateBody, setUpdateBody] = useState('')
    const [updateType, setUpdateType] = useState('CONSTRUCTION')
    const [aiLoading, setAiLoading] = useState(false)
    const [publishing, setPublishing] = useState(false)

    async function draftWithAI() {
        setAiLoading(true)
        setUpdateBody('')
        await new Promise(r => setTimeout(r, 800))
        // Simulate streaming
        const chars = AI_DRAFT.split('')
        let i = 0
        function tick() {
            if (i < chars.length) {
                const chunk = Math.floor(Math.random() * 5) + 2
                setUpdateBody(chars.slice(0, i + chunk).join(''))
                i += chunk
                setTimeout(tick, 25)
            } else {
                setUpdateBody(AI_DRAFT)
                setAiLoading(false)
                setUpdateTitle('Progress Update — February 2026')
            }
        }
        tick()
    }

    async function handlePublish() {
        setPublishing(true)
        await new Promise(r => setTimeout(r, 1000))
        setPublishing(false)
        setShowComposer(false)
        setUpdateTitle('')
        setUpdateBody('')
    }

    return (
        <div className="max-w-5xl mx-auto px-5 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Projects</h1>
                    <p className="text-text-muted text-sm mt-1">{DEMO_PROJECTS.length} projects</p>
                </div>
                <button
                    onClick={() => setShowComposer(true)}
                    className="flex items-center gap-2 bg-brand-accent text-brand-primary px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-accent-light transition-colors"
                >
                    <Plus size={16} />
                    Post Update
                </button>
            </div>

            {/* Projects grid */}
            <div className="grid md:grid-cols-3 gap-4">
                {DEMO_PROJECTS.map((project) => (
                    <div key={project.id} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                            <ProgressRing progress={project.progress} size={48} strokeWidth={4} />
                            <StatusBadge label={project.status} />
                        </div>
                        <h3 className="text-text-primary font-semibold">{project.name}</h3>
                        <p className="text-text-muted text-xs mb-3">{project.city}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                            <div className="bg-surface-dark rounded-lg p-2">
                                <p className="text-text-muted">Investors</p>
                                <p className="text-text-primary font-mono font-semibold">{project.investors}</p>
                            </div>
                            <div className="bg-surface-dark rounded-lg p-2">
                                <p className="text-text-muted">Units</p>
                                <p className="text-text-primary font-mono font-semibold">{project.units}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/builder/projects/${project.id}`} className="flex-1 text-center text-xs py-2 rounded-xl bg-surface-dark text-text-secondary hover:text-text-primary transition-colors border border-surface-border">
                                Manage
                            </Link>
                            <button
                                onClick={() => { setSelectedProject(project); setShowComposer(true) }}
                                className="flex-1 text-center text-xs py-2 rounded-xl bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors border border-brand-accent/20"
                            >
                                Post Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Update Composer Modal */}
            <AnimatePresence>
                {showComposer && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setShowComposer(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-surface-card rounded-2xl border border-surface-border shadow-card z-50 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="p-5">
                                {/* Modal header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="text-text-primary font-semibold">Post Construction Update</h2>
                                        <p className="text-text-muted text-xs mt-0.5">{selectedProject.name}</p>
                                    </div>
                                    <button onClick={() => setShowComposer(false)} className="w-8 h-8 rounded-xl bg-surface-dark flex items-center justify-center hover:bg-surface-hover transition-colors">
                                        <X size={16} className="text-text-muted" />
                                    </button>
                                </div>

                                {/* Project selector */}
                                <div className="relative mb-4">
                                    <select
                                        value={selectedProject.id}
                                        onChange={(e) => setSelectedProject(DEMO_PROJECTS.find(p => p.id === e.target.value) ?? DEMO_PROJECTS[0])}
                                        className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm appearance-none focus:border-brand-accent transition-colors"
                                    >
                                        {DEMO_PROJECTS.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                </div>

                                {/* Update type */}
                                <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4">
                                    {UPDATE_TYPES.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setUpdateType(t)}
                                            className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${updateType === t
                                                    ? 'bg-brand-accent text-brand-primary'
                                                    : 'bg-surface-dark border border-surface-border text-text-muted hover:text-text-secondary'
                                                }`}
                                        >
                                            {t.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>

                                {/* Title */}
                                <input
                                    value={updateTitle}
                                    onChange={(e) => setUpdateTitle(e.target.value)}
                                    placeholder="Update title..."
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors mb-3"
                                />

                                {/* Body */}
                                <textarea
                                    value={updateBody}
                                    onChange={(e) => setUpdateBody(e.target.value)}
                                    placeholder="Write your update here, or use AI to draft..."
                                    rows={6}
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors resize-none font-mono text-xs leading-relaxed"
                                />
                                {aiLoading && (
                                    <span className="inline-block w-0.5 h-3 bg-brand-accent ml-1 animate-pulse" />
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={draftWithAI}
                                            disabled={aiLoading}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-medium hover:bg-brand-accent/20 transition-colors disabled:opacity-50"
                                        >
                                            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
                                            Draft with AI
                                        </button>
                                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-dark border border-surface-border text-text-muted text-xs hover:text-text-secondary transition-colors">
                                            <ImageIcon size={12} />
                                            Add Photos
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowComposer(false)} className="px-3 py-2 rounded-xl text-text-muted text-xs hover:text-text-secondary transition-colors">
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            disabled={publishing || !updateTitle || !updateBody}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-accent text-brand-primary text-xs font-semibold hover:bg-brand-accent-light disabled:opacity-50 transition-colors"
                                        >
                                            {publishing ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                            Publish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
