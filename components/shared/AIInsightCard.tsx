'use client'

import { motion } from 'framer-motion'
import { Bot, TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/format'

interface AIInsightCardProps {
    title?: string
    content: string
    confidence?: number
    lastUpdated?: string
    isStreaming?: boolean
    className?: string
    variant?: 'insight' | 'alert' | 'prediction'
}

export function AIInsightCard({
    title = 'AI Insight',
    content,
    confidence,
    lastUpdated,
    isStreaming = false,
    className,
    variant = 'insight',
}: AIInsightCardProps) {
    const Icon = variant === 'alert' ? AlertCircle : variant === 'prediction' ? TrendingUp : Bot

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('card-gold p-5 relative overflow-hidden', className)}
        >
            {/* Background glow */}
            <div className="absolute inset-0 bg-glow-gold pointer-events-none" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                            <Icon size={14} className="text-brand-accent" />
                        </div>
                        <span className="text-brand-accent font-medium text-sm">{title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isStreaming && (
                            <span className="flex items-center gap-1 text-xs text-status-green">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
                                Live
                            </span>
                        )}
                        {confidence !== undefined && (
                            <span className="text-xs text-text-muted">
                                {Math.round(confidence * 100)}% confidence
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <p className="text-text-secondary text-sm leading-relaxed">
                    {content}
                    {isStreaming && (
                        <span className="inline-block w-0.5 h-4 bg-brand-accent ml-0.5 animate-pulse align-middle" />
                    )}
                </p>

                {/* Footer */}
                {lastUpdated && (
                    <p className="mt-3 text-xs text-text-muted">Updated {lastUpdated}</p>
                )}
            </div>
        </motion.div>
    )
}
