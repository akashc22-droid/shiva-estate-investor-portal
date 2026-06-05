import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
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
