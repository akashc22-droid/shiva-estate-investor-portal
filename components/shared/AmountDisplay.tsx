'use client'

import { formatINR } from '@/lib/utils/format'
import { cn } from '@/lib/utils/format'

interface AmountDisplayProps {
    amount: number
    size?: 'sm' | 'md' | 'lg' | 'xl'
    compact?: boolean
    className?: string
    prefix?: string
    showSign?: boolean
    positive?: boolean
}

const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
}

export function AmountDisplay({
    amount,
    size = 'md',
    compact = false,
    className,
    prefix,
    showSign = false,
    positive,
}: AmountDisplayProps) {
    const formatted = formatINR(amount, compact)
    const sign = showSign && amount > 0 ? '+' : ''
    const colorClass =
        positive !== undefined
            ? positive
                ? 'text-status-green'
                : 'text-status-red'
            : ''

    return (
        <span
            className={cn(
                'font-mono font-semibold tracking-tight',
                sizeClasses[size],
                colorClass,
                className
            )}
        >
            {prefix}
            {sign}
            {formatted}
        </span>
    )
}
