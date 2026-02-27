'use client'

/**
 * PoweredByArtha — floating "Powered by Artha" badge
 *
 * Renders a small pill fixed at the bottom-right corner, just above the
 * mobile bottom nav. Only mounts when showPoweredBy === true.
 */

interface PoweredByArthaProps {
    subdomain: string
    showPoweredBy: boolean
}

export function PoweredByArtha({ subdomain, showPoweredBy }: PoweredByArthaProps) {
    if (!showPoweredBy) return null

    const href = `https://artha.io?ref=${encodeURIComponent(subdomain)}`

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Powered by Artha"
            className={[
                // Position: just above the mobile bottom nav (~72px) on mobile,
                // bottom-right on desktop (sidebar is 240px wide)
                'fixed bottom-20 right-4 z-50',
                'lg:bottom-5 lg:right-5',
                // Pill styling
                'flex items-center gap-1.5 px-2.5 py-1',
                'rounded-full',
                'bg-black/40 backdrop-blur-md',
                'border border-white/[0.06]',
                'shadow-[0_2px_12px_rgba(0,0,0,0.4)]',
                'transition-all duration-200',
                'hover:bg-black/60 hover:border-white/10',
                'group',
            ].join(' ')}
        >
            {/* "Powered by" label */}
            <span
                style={{ fontSize: '9px', letterSpacing: '0.04em' }}
                className="text-white/40 font-medium uppercase leading-none group-hover:text-white/60 transition-colors"
            >
                Powered by
            </span>

            {/* Artha wordmark */}
            <span
                style={{ fontSize: '10px', letterSpacing: '0.02em' }}
                className="font-semibold leading-none text-white/70 group-hover:text-white/90 transition-colors"
            >
                Artha
            </span>

            {/* Subtle dot accent */}
            <span
                className="w-1 h-1 rounded-full bg-brand-accent/70 group-hover:bg-brand-accent transition-colors"
                aria-hidden="true"
            />
        </a>
    )
}
