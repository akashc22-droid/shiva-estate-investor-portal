/* eslint-disable @typescript-eslint/no-explicit-any */

// Prisma client stub — works even when DATABASE_URL is absent (demo/Vercel mode).
// All server pages already have try/catch that falls back to demo data on any error.

let _prisma: any = null

async function getPrismaClient(): Promise<any | null> {
    if (!process.env.DATABASE_URL) return null
    if (_prisma) return _prisma

    try {
        const { PrismaClient } = await import('@prisma/client')
        _prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        })
    } catch {
        _prisma = null
    }

    return _prisma
}

// Proxy that looks like a PrismaClient but every method returns a rejected Promise
// when DATABASE_URL is absent — all callers handle this via try/catch.
function makeStub(): any {
    return new Proxy({} as any, {
        get(_t, prop: string) {
            if (prop === 'then') return undefined // not a thenable
            return new Proxy({} as any, {
                get(_t2, method: string) {
                    return async (..._args: any[]) => {
                        const client = await getPrismaClient()
                        if (!client) {
                            throw new Error(`No DATABASE_URL — demo mode (${prop}.${method})`)
                        }
                        return client[prop][method](..._args)
                    }
                }
            })
        }
    })
}

// Export a single shared stub instance
export const prisma: any = makeStub()
