'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/format'

interface ProgressRingProps {
    progress: number // 0-100
    size?: number
    strokeWidth?: number
    className?: string
    showLabel?: boolean
    color?: string
}

export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 6,
    className,
    showLabel = true,
    color = '#C9A84C',
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#2A2A4A"
                    strokeWidth={strokeWidth}
                />
                {/* Progress ring */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono font-semibold text-sm" style={{ color }}>
                        {progress}%
                    </span>
                </div>
            )}
        </div>
    )
}
