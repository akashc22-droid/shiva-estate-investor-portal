import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as any

function createPrismaClient(): PrismaClient {
    // If no DATABASE_URL, return a stub that throws on any method call
    // All callers already have try/catch fallback to demo data
    if (!process.env.DATABASE_URL) {
        // Return a proxy that throws on any access — callers handle this gracefully
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Proxy({} as PrismaClient, {
            get(_t, prop) {
                if (prop === 'then') return undefined // not a Promise
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return new Proxy({} as any, {
                    get(_t2, method) {
                        return () => Promise.reject(new Error(`No DATABASE_URL — demo mode (${String(prop)}.${String(method)})`))
                    }
                })
            }
        })
    }

    try {
        // Standard Prisma client — works when DATABASE_URL is set
        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        })
    } catch {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Proxy({} as PrismaClient, {
            get(_t, prop) {
                if (prop === 'then') return undefined
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return new Proxy({} as any, {
                    get(_t2, method) {
                        return () => Promise.reject(new Error(`Prisma init failed (${String(prop)}.${String(method)})`))
                    }
                })
            }
        })
    }
}

export const prisma: PrismaClient =
    globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
