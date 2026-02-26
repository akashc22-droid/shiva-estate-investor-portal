/** @type {import('next').NextConfig} */
const nextConfig = {
    // Prevent webpack from trying to bundle native Node modules used by pg/Prisma
    webpack: (config, { isServer }) => {
        if (isServer) {
            // These are loaded dynamically at runtime, not bundled
            config.externals = [
                ...(config.externals || []),
                'pg',
                'pg-native',
                '@prisma/adapter-pg',
            ]
        }
        return config
    },
    // Suppress Prisma peer dep warnings
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'pg'],
    },
}

export default nextConfig
