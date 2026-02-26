'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Upload, FileText, Download, Filter } from 'lucide-react'

const DEMO_DOCS = [
    { id: '1', name: 'Allotment Letter — Unit A-1204', type: 'ALLOTMENT_LETTER', project: 'ShivaOS Skyline', date: '12 Jan 2024', size: '245 KB', icon: '📋' },
    { id: '2', name: 'Sale Agreement — SSK/AGR/2024/0847', type: 'SALE_AGREEMENT', project: 'ShivaOS Skyline', date: '15 Feb 2024', size: '890 KB', icon: '📄' },
    { id: '3', name: 'RERA Certificate — Skyline', type: 'RERA_REGISTRATION', project: 'ShivaOS Skyline', date: '10 Jun 2023', size: '180 KB', icon: '🔖' },
    { id: '4', name: 'Floor Plan — Tower A', type: 'FLOOR_PLAN', project: 'ShivaOS Skyline', date: '10 Jun 2023', size: '4.2 MB', icon: '🗺️' },
    { id: '5', name: 'Project Brochure — ShivaOS Skyline', type: 'BROCHURE', project: 'ShivaOS Skyline', date: '10 Jun 2023', size: '12.5 MB', icon: '📰' },
]

const DOC_TYPE_COLORS: Record<string, string> = {
    ALLOTMENT_LETTER: 'text-brand-accent',
    SALE_AGREEMENT: 'text-status-blue',
    RERA_REGISTRATION: 'text-status-green',
    FLOOR_PLAN: 'text-text-secondary',
    BROCHURE: 'text-text-muted',
    PAYMENT_RECEIPT: 'text-status-green',
    DEMAND_NOTICE: 'text-status-amber',
}

export default function DocumentsPage() {
    const [search, setSearch] = useState('')

    const filtered = DEMO_DOCS.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-3xl mx-auto px-5 py-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Document Vault</h1>
                    <p className="text-text-muted text-sm mt-1">{DEMO_DOCS.length} documents</p>
                </div>
                <button className="flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-accent/20 transition-colors">
                    <Upload size={14} />
                    Upload
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    id="doc-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', 'Agreements', 'Receipts', 'RERA', 'Plans'].map(f => (
                    <button key={f} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${f === 'All' ? 'bg-brand-accent text-brand-primary' : 'bg-surface-card border border-surface-border text-text-muted hover:text-text-secondary'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Document list */}
            <div className="space-y-2">
                {filtered.map((doc, i) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card p-4 flex items-center gap-3 group hover:border-surface-hover transition-colors"
                    >
                        <div className="w-11 h-11 rounded-xl bg-surface-dark flex items-center justify-center text-xl flex-shrink-0">
                            {doc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-text-primary text-sm font-medium truncate">{doc.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-medium ${DOC_TYPE_COLORS[doc.type] ?? 'text-text-muted'}`}>
                                    {doc.type.replace(/_/g, ' ')}
                                </span>
                                <span className="text-text-muted text-[10px]">·</span>
                                <span className="text-text-muted text-[10px]">{doc.project}</span>
                                <span className="text-text-muted text-[10px]">·</span>
                                <span className="text-text-muted text-[10px]">{doc.size}</span>
                            </div>
                            <p className="text-text-muted text-[10px] mt-0.5">{doc.date}</p>
                        </div>
                        <button className="w-8 h-8 rounded-lg bg-surface-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-accent/10">
                            <Download size={14} className="text-text-secondary" />
                        </button>
                    </motion.div>
                ))}
                {filtered.length === 0 && (
                    <div className="card p-10 text-center">
                        <FileText size={32} className="text-text-muted mx-auto mb-3" />
                        <p className="text-text-secondary font-medium">No documents found</p>
                        <p className="text-text-muted text-sm mt-1">Try a different search</p>
                    </div>
                )}
            </div>
        </div>
    )
}
