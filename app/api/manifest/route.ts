/**
 * app/api/manifest/route.ts
 *
 * Generates a dynamic Web App Manifest per builder subdomain.
 * Called via: <link rel="manifest" href="/api/manifest?subdomain=shivaos" />
 *
 * Falls back to Shiva Estate defaults when no subdomain is provided
 * or when DATABASE_URL is absent (demo mode).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBuilderBrand } from '@/lib/brand'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const subdomain = searchParams.get('subdomain') ?? 'shivaos'

    // Resolve brand — falls back to DEMO_BRAND silently when no DB
    const brand = await getBuilderBrand(subdomain)

    const manifest = {
        name: `${brand.name} Investor Portal`,
        short_name: brand.name,
        description: brand.tagline ?? 'Track your investment. Monitor construction. Predict your returns.',
        start_url: '/dashboard',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0F0F1A',
        theme_color: brand.primaryColor,
        categories: ['finance', 'business'],
        lang: 'en',
        icons: [
            {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable',
            },
            {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
        shortcuts: [
            {
                name: 'Dashboard',
                short_name: 'Home',
                url: '/dashboard',
                description: 'View your investment dashboard',
            },
            {
                name: 'Projects',
                short_name: 'Projects',
                url: '/projects',
                description: 'Browse all projects',
            },
            {
                name: 'AI Returns',
                short_name: 'Returns',
                url: '/returns',
                description: 'AI-powered return analysis',
            },
        ],
        // Artha platform attribution
        related_applications: [],
        prefer_related_applications: false,
    }

    return NextResponse.json(manifest, {
        headers: {
            'Content-Type': 'application/manifest+json',
            // Cache for 1 hour — brand colours rarely change
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
    })
}
