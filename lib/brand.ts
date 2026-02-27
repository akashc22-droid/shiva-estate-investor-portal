/**
 * lib/brand.ts
 * Artha Platform — Multi-tenant builder brand resolution.
 *
 * Usage (server component / server action):
 *   const brand = await getBuilderBrand('shivaos')
 *
 * In demo mode (no DATABASE_URL), returns the Shiva Estate fallback brand
 * so every page still renders correctly without a live DB.
 */

export interface BuilderBrand {
    subdomain: string
    name: string
    logoUrl: string | null
    faviconUrl: string | null
    primaryColor: string
    accentColor: string
    tagline: string | null
    showPoweredBy: boolean
    tier: 'STARTER' | 'GROWTH' | 'ENTERPRISE'
    /** Artha platform flag — always true */
    isPlatform: true
}

/** Shiva Estate demo brand — used when no DB is connected (Vercel demo deployments) */
const DEMO_BRAND: BuilderBrand = {
    subdomain: 'shivaos',
    name: 'Shiva Estate',
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#C9A84C',
    accentColor: '#1A1A2E',
    tagline: 'Shiva Buildcon · Shiva Investments',
    showPoweredBy: true,
    tier: 'STARTER',
    isPlatform: true,
}

/**
 * Resolves the brand for a given builder subdomain.
 *
 * @param subdomain - e.g. "shivaos" from shivaos.artha.io or x-subdomain header
 * @returns BuilderBrand — always resolves (falls back to demo if DB is absent or
 *          the subdomain isn't found)
 */
export async function getBuilderBrand(
    subdomain: string
): Promise<BuilderBrand> {
    // Normalise — strip artha.io suffix if accidentally passed
    const slug = subdomain.replace(/\.artha\.io$/, '').toLowerCase().trim()

    try {
        const { prisma } = await import('@/lib/prisma/client')

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const builder: any = await prisma.builder.findUnique({
            where: { subdomain: slug },
            select: {
                name: true,
                logoUrl: true,
                faviconUrl: true,
                primaryColor: true,
                accentColor: true,
                tagline: true,
                subdomain: true,
                showPoweredBy: true,
                tier: true,
            },
        })

        if (!builder) {
            console.warn(`[Artha] No builder found for subdomain "${slug}" — using demo brand`)
            return DEMO_BRAND
        }

        return {
            subdomain: builder.subdomain,
            name: builder.name,
            logoUrl: builder.logoUrl ?? null,
            faviconUrl: builder.faviconUrl ?? null,
            primaryColor: builder.primaryColor ?? '#C9A84C',
            accentColor: builder.accentColor ?? '#1A1A2E',
            tagline: builder.tagline ?? null,
            showPoweredBy: builder.showPoweredBy ?? true,
            tier: builder.tier ?? 'STARTER',
            isPlatform: true,
        }
    } catch (err) {
        // DB not connected (demo / Vercel without DATABASE_URL) — silent fallback
        if (process.env.NODE_ENV === 'development') {
            console.warn('[Artha] getBuilderBrand fallback (no DB):', (err as Error).message)
        }
        return DEMO_BRAND
    }
}

/**
 * Extracts the builder subdomain from a Next.js request hostname.
 *
 * Examples:
 *   shivaos.artha.io        → "shivaos"
 *   invest.shivaestate.com  → "shivaos" (via customDomain lookup — future)
 *   localhost:3000           → "shivaos" (dev fallback)
 *
 * @param hostname - from headers().get('host') or request.headers.get('host')
 */
export function extractSubdomain(hostname: string | null): string {
    if (!hostname) return 'shivaos'

    const host = hostname.split(':')[0] // strip port

    // Local dev — always shivaos
    if (host === 'localhost' || host === '127.0.0.1') return 'shivaos'

    // Vercel preview deployments (shiva-estate-investor-portal.vercel.app)
    if (host.includes('vercel.app')) return 'shivaos'

    // Standard artha.io subdomain: shivaos.artha.io
    const parts = host.split('.')
    if (parts.length >= 3 && parts.slice(-2).join('.') === 'artha.io') {
        return parts[0]
    }

    // Custom domain or unknown — default to shivaos for now
    // Future: look up Builder.customDomain in DB
    return 'shivaos'
}
