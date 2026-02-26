'use client'

import { cn } from '@/lib/utils/format'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
    {
        variants: {
            variant: {
                green: 'bg-status-green/10 text-status-green border border-status-green/20',
                amber: 'bg-status-amber/10 text-status-amber border border-status-amber/20',
                red: 'bg-status-red/10 text-status-red border border-status-red/20',
                blue: 'bg-status-blue/10 text-status-blue border border-status-blue/20',
                gold: 'bg-brand-accent/10 text-brand-accent border border-brand-accent/30',
                muted: 'bg-surface-border/50 text-text-secondary border border-surface-border',
            },
        },
        defaultVariants: { variant: 'muted' },
    }
)

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
    label: string
    dot?: boolean
    className?: string
}

const STATUS_MAP: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
    UNDER_CONSTRUCTION: 'amber',
    NEAR_COMPLETION: 'blue',
    COMPLETED: 'green',
    UPCOMING: 'muted',
    LAUNCHED: 'gold',
    DELAYED: 'red',
    IN_PROGRESS: 'amber',
    UPCOMING_MILESTONE: 'muted',
    BOOKED: 'gold',
    AGREEMENT_SIGNED: 'blue',
    READY_FOR_POSSESSION: 'green',
    POSSESSION_GIVEN: 'green',
    REGISTERED: 'green',
}

const STATUS_LABELS: Record<string, string> = {
    UNDER_CONSTRUCTION: 'Under Construction',
    NEAR_COMPLETION: 'Near Completion',
    COMPLETED: 'Completed',
    UPCOMING: 'Upcoming',
    LAUNCHED: 'Launched',
    DELAYED: 'Delayed',
    IN_PROGRESS: 'In Progress',
    BOOKED: 'Booked',
    AGREEMENT_SIGNED: 'Agreement Signed',
    READY_FOR_POSSESSION: 'Ready for Possession',
    POSSESSION_GIVEN: 'Possession Given',
    REGISTERED: 'Registered',
}

export function StatusBadge({
    label,
    variant,
    dot = true,
    className,
}: StatusBadgeProps) {
    const resolvedVariant = variant ?? STATUS_MAP[label] ?? 'muted'
    const displayLabel = STATUS_LABELS[label] ?? label

    return (
        <span className={cn(badgeVariants({ variant: resolvedVariant }), className)}>
            {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
            {displayLabel}
        </span>
    )
}
