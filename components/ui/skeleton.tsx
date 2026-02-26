'use client'

import { cn } from '@/lib/utils/format'

interface SkeletonProps {
    className?: string
    lines?: number
}

export function Skeleton({ className }: { className?: string }) {
    return <div className={cn('skeleton h-4 w-full', className)} />
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
    return (
        <div className="card p-5 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
            ))}
        </div>
    )
}

export function SkeletonStat() {
    return (
        <div className="card p-5 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-24" />
        </div>
    )
}
