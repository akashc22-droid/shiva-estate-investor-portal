'use client'

import { useState } from 'react'
import { Search, Download, ChevronRight, Globe, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatINR } from '@/lib/utils/format'
import { StatusBadge } from '@/components/shared/StatusBadge'

const DEMO_INVESTORS = [
    { id: '1', name: 'Rajesh Sharma', phone: '+91 98765 43210', project: 'ShivaOS Skyline', unit: 'A-1204', invested: 12000000, paid: 8500000, status: 'UNDER_CONSTRUCTION', lastLogin: '2 days ago', isNRI: false },
    { id: '2', name: 'Priya Nair', phone: '+971 50 123 4567', project: 'ShivaOS Skyline', unit: 'A-1201', invested: 18500000, paid: 13000000, status: 'UNDER_CONSTRUCTION', lastLogin: '1 day ago', isNRI: true },
    { id: '3', name: 'Vikram Mehta', phone: '+91 99887 76655', project: 'ShivaOS Gardens', unit: 'VILLA-A-12', invested: 24000000, paid: 24000000, status: 'READY_FOR_POSSESSION', lastLogin: '5 days ago', isNRI: false },
    { id: '4', name: 'Sunita Reddy', phone: '+91 94456 78901', project: 'ShivaOS Skyline', unit: 'A-0803', invested: 9500000, paid: 6000000, status: 'UNDER_CONSTRUCTION', lastLogin: '1 week ago', isNRI: false },
    { id: '5', name: 'Arjun Kapoor', phone: '+91 80011 22334', project: 'ShivaOS Horizon', unit: 'Pre-registered', invested: 1600000, paid: 200000, status: 'BOOKED', lastLogin: '3 weeks ago', isNRI: false },
]

export default function BuilderInvestorsPage() {
    const [search, setSearch] = useState('')

    const filtered = DEMO_INVESTORS.filter(inv =>
        inv.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.project.toLowerCase().includes(search.toLowerCase()) ||
        inv.unit.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-5xl mx-auto px-5 py-6 space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">All Investors</h1>
                    <p className="text-text-muted text-sm mt-1">{DEMO_INVESTORS.length} investors across 3 projects</p>
                </div>
                <button className="flex items-center gap-2 bg-surface-card border border-surface-border text-text-secondary px-4 py-2 rounded-xl text-sm hover:text-text-primary transition-colors">
                    <Download size={14} />
                    Export CSV
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    id="investor-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, project, or unit..."
                    className="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors"
                />
            </div>

            {/* Table (mobile: card, desktop: table) */}
            <div className="hidden md:block card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-border">
                            {['Investor', 'Project / Unit', 'Invested', 'Paid %', 'Status', 'Last Login'].map(h => (
                                <th key={h} className="text-left text-xs text-text-muted px-4 py-3 font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        {filtered.map((inv) => (
                            <tr key={inv.id} className="hover:bg-surface-hover transition-colors cursor-pointer group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center">
                                            {inv.isNRI ? <Globe size={12} className="text-brand-accent" /> : <User size={12} className="text-brand-accent" />}
                                        </div>
                                        <div>
                                            <p className="text-text-primary text-sm font-medium">{inv.name}</p>
                                            <p className="text-text-muted text-xs">{inv.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-text-secondary text-sm">{inv.project}</p>
                                    <p className="text-text-muted text-xs font-mono">{inv.unit}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-mono text-text-primary text-sm">{formatINR(inv.invested, true)}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-surface-border rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-accent rounded-full" style={{ width: `${(inv.paid / inv.invested) * 100}%` }} />
                                        </div>
                                        <span className="text-text-muted text-xs">{Math.round((inv.paid / inv.invested) * 100)}%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge label={inv.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-text-muted text-xs">{inv.lastLogin}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
                {filtered.map((inv, i) => (
                    <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card p-4 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                            {inv.isNRI ? <Globe size={16} className="text-brand-accent" /> : <User size={16} className="text-brand-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-text-primary font-medium text-sm">{inv.name}</p>
                                {inv.isNRI && <span className="text-[9px] text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded">NRI</span>}
                            </div>
                            <p className="text-text-muted text-xs">{inv.project} · {inv.unit}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-xs text-text-secondary">{formatINR(inv.invested, true)}</span>
                                <span className="text-text-muted text-xs">·</span>
                                <StatusBadge label={inv.status} />
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-text-muted" />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
