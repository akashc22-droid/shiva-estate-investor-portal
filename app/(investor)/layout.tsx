/**
 * app/(investor)/layout.tsx — Server Component
 *
 * Reads the x-builder-subdomain header (injected by middleware.ts),
 * resolves the BuilderBrand, injects PWA meta tags, then passes
 * showPoweredBy + subdomain down to the client InvestorShell.
 */

import { headers } from 'next/headers'
import { getBuilderBrand } from '@/lib/brand'
import { InvestorShell } from './InvestorShell'

export default async function InvestorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Read subdomain injected by middleware
    const headersList = headers()
    const subdomain = headersList.get('x-builder-subdomain') ?? 'shivaos'

    // Resolve brand — falls back to DEMO_BRAND when no DB is connected
    const brand = await getBuilderBrand(subdomain)

    return (
        <>
            {/* ── PWA + mobile web app meta tags ─────────────────────────────── */}
            <head>
                {/* Dynamic manifest — brand-aware per subdomain */}
                <link rel="manifest" href={`/api/manifest?subdomain=${subdomain}`} />

                {/* iOS / Safari PWA meta */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content={`${brand.name} Portal`} />

                {/* Android / Chrome PWA */}
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="application-name" content={brand.name} />

                {/* Theme colour — matches brand primaryColor */}
                <meta name="theme-color" content={brand.primaryColor} />
                <meta name="msapplication-TileColor" content={brand.primaryColor} />

                {/* Touch icon (iOS home screen) */}
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </head>

            {/* ── Investor shell (client component with nav + badge) ─────────── */}
            <InvestorShell
                showPoweredBy={brand.showPoweredBy}
                subdomain={brand.subdomain}
            >
                {children}
            </InvestorShell>
        </>
    )
}
