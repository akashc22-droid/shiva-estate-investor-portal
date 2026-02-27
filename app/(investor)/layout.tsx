/**
 * app/(investor)/layout.tsx — Server Component
 *
 * Reads the x-builder-subdomain header (injected by middleware.ts),
 * resolves the BuilderBrand, then passes showPoweredBy + subdomain
 * down to the client shell which renders <PoweredByArtha>.
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
        <InvestorShell
            showPoweredBy={brand.showPoweredBy}
            subdomain={brand.subdomain}
        >
            {children}
        </InvestorShell>
    )
}
