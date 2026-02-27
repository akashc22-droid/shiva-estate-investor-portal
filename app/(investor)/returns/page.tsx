'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Loader2, Bot, RefreshCw, ChevronDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AmountDisplay } from '@/components/shared/AmountDisplay'

const DEMO_INVESTMENTS = [
    {
        id: 'inv1',
        projectName: 'Sankhedi Project — Plot SP-07',
        investedAmount: 7500000,
        currentMarketValue: 8625000,
        unrealisedGainPct: 15.0,
        projectedMin: 9000000,
        projectedMax: 10200000,
        irrMin: 14.5,
        irrMax: 20.0,
        confidenceScore: 0.80,
        predictedReturnRange: '14–20%',
    },
]

const CHART_DATA = [
    { month: 'Apr \'24', invested: 375000, projected: 375000 },
    { month: 'Jun \'24', invested: 1125000, projected: 1180000 },
    { month: 'Sep \'24', invested: 2250000, projected: 2420000 },
    { month: 'Dec \'24', invested: 3750000, projected: 4100000 },
    { month: 'Mar \'25', invested: 4500000, projected: 5050000 },
    { month: 'Dec \'26', invested: 7500000, projected: 8625000 },
    { month: 'Dec \'27', invested: 7500000, projected: 9800000 },
]

const COMPS = [
    { name: 'Kolar Road Plots (Avg)', launch: '₹2,800/sqft', current: '₹3,850/sqft', change: '+37.5%' },
    { name: 'Banjari Heights', launch: '₹3,100/sqft', current: '₹4,000/sqft', change: '+29.0%' },
    { name: 'Nayapura Township', launch: '₹2,600/sqft', current: '₹3,400/sqft', change: '+30.8%' },
    { name: 'Salaiya Corridor', launch: '₹2,400/sqft', current: '₹3,100/sqft', change: '+29.2%' },
]

function formatChartAmount(val: number) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`
    return `₹${val}`
}

export default function ReturnsPage() {
    const [selectedInv] = useState(DEMO_INVESTMENTS[0])
    const [streaming, setStreaming] = useState(false)
    const [streamedText, setStreamedText] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const AI_ANALYSIS = `Based on analysis of 28 registered plot transactions on the Kolar Road and Banjari corridor over the last 18 months, residential plots in this zone have appreciated at 12–18% annually. Sankhedi Project's location near SAGE International School places it in a high-demand micro-market driven by education infrastructure and expanding IT workforce housing.

Infrastructure catalysts — the Kolar Road widening project, new BRTS corridor, and proximity to Rajiv Gandhi College — are driving robust buyer demand. Current plot absorption rate in the Kolar Road micro-market stands at 72%, up 15 points year-over-year. RERA compliance score of 88/100.

Considering your purchase price of ₹3,800/sqft (Plot SP-07, 1800 sqft), the projected exit value of ₹5,000–5,600/sqft at registry (December 2026) translates to an unrealised gain of 14–20%. The IRR of 14.5–20.0% compares favourably with comparable plotted developments in Nayapura, Banjari, and Salaiya corridors.

Risk factors: Project is 55% complete with RERA registration active (P4500012345). Market risk is low given consistent end-user demand. Recommended hold: post-registry + 24 months for optimal capital gains treatment.`

    function startStreaming() {
        setStreaming(true)
        setStreamedText('')
        setIsComplete(false)
        let i = 0
        const chars = AI_ANALYSIS.split('')

        function tick() {
            if (i < chars.length) {
                const chunkSize = Math.floor(Math.random() * 4) + 2
                setStreamedText(chars.slice(0, i + chunkSize).join(''))
                i += chunkSize
                streamRef.current = setTimeout(tick, 20)
            } else {
                setStreamedText(AI_ANALYSIS)
                setStreaming(false)
                setIsComplete(true)
            }
        }
        tick()
    }

    useEffect(() => {
        startStreaming()
        return () => { if (streamRef.current) clearTimeout(streamRef.current) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">AI Return Analysis</h1>
                <p className="text-text-muted text-sm mt-1">Powered by Claude AI · Live market data</p>
            </div>

            {/* Project selector */}
            <div className="card p-3 flex items-center justify-between cursor-pointer hover:border-brand-accent/30 transition-colors">
                <div>
                    <p className="text-text-muted text-xs">Analysing</p>
                    <p className="text-text-primary font-medium text-sm">{selectedInv.projectName}</p>
                </div>
                <ChevronDown size={16} className="text-text-muted" />
            </div>

            {/* Key metrics */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
            >
                <div className="card p-4">
                    <p className="text-text-muted text-xs mb-1">Your Investment</p>
                    <AmountDisplay amount={selectedInv.investedAmount} compact size="lg" />
                    <p className="text-text-muted text-xs mt-1">total agreed</p>
                </div>
                <div className="card p-4">
                    <p className="text-text-muted text-xs mb-1">Market Value Today</p>
                    <AmountDisplay amount={selectedInv.currentMarketValue} compact size="lg" />
                    <p className="text-status-green text-xs mt-1">▲ +{selectedInv.unrealisedGainPct}% unrealised</p>
                </div>
            </motion.div>

            {/* Projected value card */}
            <div className="card-gold p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-glow-gold pointer-events-none" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-brand-accent" />
                        <p className="text-brand-accent font-semibold text-sm">Projected Value at Registry (Dec &apos;26)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-text-muted text-xs">Value Range</p>
                            <p className="font-mono font-bold text-xl text-text-primary mt-1">
                                {formatChartAmount(selectedInv.projectedMin)} – {formatChartAmount(selectedInv.projectedMax)}
                            </p>
                        </div>
                        <div>
                            <p className="text-text-muted text-xs">IRR Range</p>
                            <p className="font-mono font-bold text-xl text-status-green mt-1">
                                {selectedInv.irrMin}% – {selectedInv.irrMax}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="card p-5">
                <p className="text-text-primary font-semibold mb-4">Investment vs Projected Value</p>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                            <defs>
                                <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2A2A4A" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#2A2A4A" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" tick={{ fill: '#5A5A75', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={formatChartAmount} tick={{ fill: '#5A5A75', fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
                            <Tooltip
                                contentStyle={{ background: '#1E1E35', border: '1px solid #2A2A4A', borderRadius: 12 }}
                                labelStyle={{ color: '#9B9BB0', fontSize: 11 }}
                                formatter={(val: number | undefined) => [val !== undefined ? formatChartAmount(val) : '', '']}
                            />
                            <Area type="monotone" dataKey="invested" stroke="#2A2A4A" fill="url(#investedGrad)" strokeWidth={2} name="Invested" />
                            <Area type="monotone" dataKey="projected" stroke="#C9A84C" fill="url(#projectedGrad)" strokeWidth={2} name="Projected" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <div className="w-3 h-0.5 bg-surface-border" />Invested
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <div className="w-3 h-0.5 bg-brand-accent" />Projected
                    </div>
                </div>
            </div>

            {/* AI Reasoning */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                            <Bot size={14} className="text-brand-accent" />
                        </div>
                        <p className="text-brand-accent font-semibold text-sm">AI Reasoning</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {streaming && (
                            <span className="flex items-center gap-1 text-xs text-status-green">
                                <Loader2 size={10} className="animate-spin" />
                                Analysing...
                            </span>
                        )}
                        {isComplete && (
                            <button
                                onClick={startStreaming}
                                className="flex items-center gap-1 text-xs text-text-muted hover:text-brand-accent transition-colors"
                            >
                                <RefreshCw size={11} />
                                Refresh
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {streamedText}
                    {streaming && (
                        <span className="inline-block w-0.5 h-4 bg-brand-accent ml-0.5 animate-pulse align-middle" />
                    )}
                </div>
            </div>

            {/* Comparable projects */}
            <div className="card p-5">
                <p className="text-text-primary font-semibold mb-4">Comparable Projects — Kolar Road, Bhopal</p>
                <div className="space-y-2">
                    {COMPS.map((comp) => (
                        <div key={comp.name} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                            <p className="text-text-secondary text-sm">{comp.name}</p>
                            <div className="flex items-center gap-4 text-xs font-mono">
                                <span className="text-text-muted">{comp.launch}</span>
                                <span className="text-text-secondary">{comp.current}</span>
                                <span className="text-status-green font-semibold">{comp.change}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
