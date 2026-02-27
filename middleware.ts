/**
 * middleware.ts — Artha Platform: Subdomain Multi-Tenancy + Supabase Auth
 *
 * Responsibilities (in order):
 *   1. Extract builder subdomain from hostname → inject as "x-builder-subdomain" header
 *   2. Enforce Supabase session auth on protected routes (skipped in demo mode)
 *
 * Subdomain resolution rules:
 *   shivaos.artha.io          → "shivaos"
 *   shivaos.localhost:3000    → "shivaos"
 *   localhost:3000            → "shivaos"  (default)
 *   invest.shivaestate.com    → "invest.shivaestate.com"  (custom domain — full host as key)
 *   *.vercel.app              → "shivaos"  (demo/preview deployments)
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ─── Subdomain extraction ──────────────────────────────────────────────────────

const DEFAULT_SUBDOMAIN = 'shivaos'
const ARTHA_ROOT_DOMAIN = 'artha.io'

function resolveSubdomain(hostname: string | null): string {
    if (!hostname) return DEFAULT_SUBDOMAIN

    // Strip port number (e.g. "shivaos.localhost:3000" → "shivaos.localhost")
    const host = hostname.split(':')[0].toLowerCase()

    // --- Vercel preview / production deployments ---
    // e.g. shiva-estate-investor-portal.vercel.app
    if (host.endsWith('.vercel.app') || host === 'shiva-estate-investor-portal.vercel.app') {
        return DEFAULT_SUBDOMAIN
    }

    // --- artha.io subdomains ---
    // e.g. shivaos.artha.io → "shivaos"
    if (host.endsWith(`.${ARTHA_ROOT_DOMAIN}`)) {
        const sub = host.slice(0, host.length - ARTHA_ROOT_DOMAIN.length - 1)
        return sub || DEFAULT_SUBDOMAIN
    }

    // --- artha.io root itself (no subdomain) ---
    if (host === ARTHA_ROOT_DOMAIN) return DEFAULT_SUBDOMAIN

    // --- localhost multi-tenant testing ---
    // e.g. shivaos.localhost → "shivaos"
    if (host.endsWith('.localhost')) {
        const sub = host.slice(0, host.length - '.localhost'.length)
        return sub || DEFAULT_SUBDOMAIN
    }

    // --- bare localhost (dev without subdomain) ---
    if (host === 'localhost' || host === '127.0.0.1') return DEFAULT_SUBDOMAIN

    // --- custom domain ---
    // e.g. invest.shivaestate.com → use full host as lookup key
    // lib/brand.ts will resolve it against Builder.customDomain in the DB
    return host
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const hostname = request.headers.get('host')

    // ── Step 1: Resolve subdomain and inject header ─────────────────────────────
    const subdomain = resolveSubdomain(hostname)

    // Clone request headers so we can mutate them
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-builder-subdomain', subdomain)

    // ── Step 2: Auth enforcement ────────────────────────────────────────────────

    // Public routes — always allow through
    const publicPaths = ['/login', '/builder-login', '/api/', '/_next/', '/favicon']
    const isPublic = publicPaths.some(p => pathname.startsWith(p)) || pathname === '/'

    // Check for Supabase credentials — if absent, run in demo mode (no auth)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        // Demo mode: no auth enforcement — pass through with subdomain header
        return NextResponse.next({
            request: { headers: requestHeaders },
        })
    }

    // Auth mode: normal Supabase session check
    let supabaseResponse = NextResponse.next({
        request: { headers: requestHeaders },
    })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                supabaseResponse = NextResponse.next({
                    request: { headers: requestHeaders },
                })
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                )
            },
        },
    })

    // Refresh session
    const { data: { session } } = await supabase.auth.getSession()

    // Redirect unauthenticated users away from protected routes
    if (!session && !isPublic) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
}

// ─── Matcher ───────────────────────────────────────────────────────────────────
// Excludes: static assets, images, favicon, and auth API routes

export const config = {
    matcher: [
        /*
         * Match all paths EXCEPT:
         *   - _next/static  (static chunks)
         *   - _next/image   (image optimisation)
         *   - favicon.ico
         *   - api/auth      (Supabase auth callbacks — must not be intercepted)
         *   - common static extensions
         */
        '/((?!_next/static|_next/image|favicon\\.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}
