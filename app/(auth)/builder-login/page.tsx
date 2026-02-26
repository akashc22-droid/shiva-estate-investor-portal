'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BuilderLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function getSupabase() {
        const { createClient } = await import('@/lib/supabase/client')
        return createClient()
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const supabase = await getSupabase()
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
            if (authError) { setError(authError.message); return }
            router.push('/builder/dashboard')
        } catch {
            setError('Authentication not configured — use Demo Login on the main page.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col items-center justify-center px-5">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mx-auto mb-4">
                        <Building2 size={24} className="text-brand-accent" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-text-primary mb-1">
                        Builder Admin
                    </h1>
                    <p className="text-text-secondary text-sm">Shiva Estate · Admin Portal</p>
                </div>

                <div className="card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-text-secondary mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    id="builder-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@shivaestate.com"
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl pl-9 pr-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    id="builder-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl pl-9 pr-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-status-amber text-xs bg-status-amber/5 border border-status-amber/20 rounded-lg px-3 py-2">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-semibold py-3 rounded-xl hover:bg-brand-accent-light transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                            Sign In
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6 space-y-2">
                    <button
                        onClick={() => router.push('/builder/dashboard')}
                        className="block w-full text-brand-accent text-xs border border-brand-accent/20 rounded-xl py-2 hover:bg-brand-accent/5 transition-colors"
                    >
                        ▷ Demo Admin View (no login needed)
                    </button>
                    <Link href="/login" className="block text-text-muted text-xs hover:text-text-secondary transition-colors">
                        ← Back to Investor Login
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
