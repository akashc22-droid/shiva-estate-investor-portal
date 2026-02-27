import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const withPWA = require('next-pwa')({
    dest: 'public',
    // Disable service worker in development to avoid caching issues
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    // Don't precache next image optimisation or API routes
    buildExcludes: [/middleware-manifest\.json$/],
    publicExcludes: ['!icons/**/*'],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Prevent webpack from trying to bundle native Node modules used by pg/Prisma
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = [
                ...(config.externals || []),
                'pg',
                'pg-native',
                '@prisma/adapter-pg',
            ]
        }
        return config
    },
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'pg'],
    },
}

export default withPWA(nextConfig)
