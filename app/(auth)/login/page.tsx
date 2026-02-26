'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, ArrowRight, Shield, ChevronRight, Loader2, CheckCircle, Play } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Step = 'input' | 'otp' | 'email_sent'
type Mode = 'phone' | 'email'

// Demo investors for the bypass
const DEMO_USERS = [
    { name: 'Rajesh Sharma', subtitle: 'Sankhedi Project · Plot SP-07', href: '/dashboard' },
    { name: 'Priya Nair (NRI)', subtitle: 'Pinaki Home · Flat PH-204', href: '/dashboard' },
    { name: 'Builder Admin', subtitle: 'Shiva Estate — Admin View', href: '/builder/dashboard' },
]

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<Mode>('phone')
    const [step, setStep] = useState<Step>('input')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showDemo, setShowDemo] = useState(false)

    async function getSupabase() {
        const { createClient } = await import('@/lib/supabase/client')
        return createClient()
    }

    async function handlePhoneSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const supabase = await getSupabase()
            const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`
            const { error: authError } = await supabase.auth.signInWithOtp({ phone: fullPhone })
            if (authError) { setError(authError.message); return }
            setStep('otp')
        } catch {
            setError('Supabase not configured — use Demo Login below for the client walkthrough.')
        } finally {
            setLoading(false)
        }
    }

    async function handleOtpVerify(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const supabase = await getSupabase()
            const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`
            const { error: authError } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: 'sms' })
            if (authError) { setError(authError.message); return }
            router.push('/dashboard')
        } catch {
            setError('Authentication not configured — use Demo Login.')
        } finally {
            setLoading(false)
        }
    }

    async function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const supabase = await getSupabase()
            const { error: authError } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${window.location.origin}/dashboard` },
            })
            if (authError) { setError(authError.message); return }
            setStep('email_sent')
        } catch {
            setError('Authentication not configured — use Demo Login.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col">
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-primary/50 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-accent/3 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-12">
                {/* Logo & Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center mx-auto mb-4 shadow-gold">
                        <span className="text-2xl font-display font-bold text-brand-accent">SE</span>
                    </div>
                    <h1 className="font-display text-2xl font-bold text-text-primary mb-1">
                        Shiva Estate Investor Portal
                    </h1>
                    <p className="text-text-secondary text-sm">Shiva Buildcon · Shiva Investments</p>
                    <p className="text-text-muted text-xs mt-1 italic">An evening of vision, growth, and new opportunities.</p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <div className="card p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            {step === 'input' && (
                                <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                    <h2 className="font-display text-xl font-semibold text-text-primary mb-1">Welcome back</h2>
                                    <p className="text-text-secondary text-sm mb-6">Sign in to access your investment dashboard</p>

                                    {/* Mode Toggle */}
                                    <div className="flex bg-surface-dark rounded-xl p-1 mb-6">
                                        {(['phone', 'email'] as Mode[]).map((m) => (
                                            <button key={m} onClick={() => setMode(m)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-surface-card text-text-primary shadow-card' : 'text-text-muted hover:text-text-secondary'}`}>
                                                {m === 'phone' ? <Phone size={14} /> : <Mail size={14} />}
                                                {m === 'phone' ? 'Mobile OTP' : 'Email Link'}
                                            </button>
                                        ))}
                                    </div>

                                    {mode === 'phone' ? (
                                        <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                            <div>
                                                <label className="text-xs text-text-secondary mb-1.5 block">Mobile Number</label>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center px-3 bg-surface-dark border border-surface-border rounded-xl text-text-secondary text-sm">+91</div>
                                                    <input id="phone-input" type="tel" value={phone}
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="98765 43210" maxLength={10}
                                                        className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors"
                                                        required />
                                                </div>
                                            </div>
                                            {error && <p className="text-status-amber text-xs bg-status-amber/5 border border-status-amber/20 rounded-lg px-3 py-2">{error}</p>}
                                            <button type="submit" disabled={loading || phone.length < 10}
                                                className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-semibold py-3 rounded-xl hover:bg-brand-accent-light transition-colors disabled:opacity-50">
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Send OTP {!loading && <ArrowRight size={16} />}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                                            <div>
                                                <label className="text-xs text-text-secondary mb-1.5 block">Email Address</label>
                                                <input id="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:border-brand-accent transition-colors"
                                                    required />
                                            </div>
                                            {error && <p className="text-status-amber text-xs bg-status-amber/5 border border-status-amber/20 rounded-lg px-3 py-2">{error}</p>}
                                            <button type="submit" disabled={loading}
                                                className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-semibold py-3 rounded-xl hover:bg-brand-accent-light transition-colors disabled:opacity-50">
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Send Magic Link {!loading && <ArrowRight size={16} />}
                                            </button>
                                        </form>
                                    )}

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-5">
                                        <div className="flex-1 h-px bg-surface-border" />
                                        <span className="text-text-muted text-xs">or</span>
                                        <div className="flex-1 h-px bg-surface-border" />
                                    </div>

                                    {/* Demo Login button */}
                                    <button
                                        onClick={() => setShowDemo(!showDemo)}
                                        className="w-full flex items-center justify-center gap-2 border border-brand-accent/30 text-brand-accent py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/5 transition-colors"
                                    >
                                        <Play size={14} />
                                        Demo Login — Client Walkthrough
                                    </button>

                                    {/* Demo user selector */}
                                    <AnimatePresence>
                                        {showDemo && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-3 overflow-hidden"
                                            >
                                                <p className="text-text-muted text-[10px] text-center mb-2">Select a demo account to explore</p>
                                                <div className="space-y-1.5">
                                                    {DEMO_USERS.map((user) => (
                                                        <button
                                                            key={user.name}
                                                            onClick={() => router.push(user.href)}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-dark border border-surface-border hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all text-left"
                                                        >
                                                            <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-brand-accent text-xs font-bold">{user.name[0]}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-text-primary text-sm font-medium">{user.name}</p>
                                                                <p className="text-text-muted text-[10px]">{user.subtitle}</p>
                                                            </div>
                                                            <ChevronRight size={14} className="ml-auto text-text-muted" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {step === 'otp' && (
                                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <button onClick={() => setStep('input')} className="flex items-center gap-1 text-text-muted text-xs mb-4 hover:text-text-secondary transition-colors">← Back</button>
                                    <h2 className="font-display text-xl font-semibold text-text-primary mb-1">Enter OTP</h2>
                                    <p className="text-text-secondary text-sm mb-6">Sent to +91 {phone}</p>
                                    <form onSubmit={handleOtpVerify} className="space-y-4">
                                        <input id="otp-input" type="text" value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="6-digit OTP" maxLength={6}
                                            className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-center text-2xl font-mono tracking-widest focus:border-brand-accent transition-colors"
                                            required />
                                        {error && <p className="text-status-amber text-xs">{error}</p>}
                                        <button type="submit" disabled={loading || otp.length < 6}
                                            className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-semibold py-3 rounded-xl hover:bg-brand-accent-light disabled:opacity-50 transition-colors">
                                            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                            Verify & Sign In
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'email_sent' && (
                                <motion.div key="email_sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                                    <div className="w-16 h-16 rounded-full bg-status-green/10 border border-status-green/20 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={28} className="text-status-green" />
                                    </div>
                                    <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Check your email</h2>
                                    <p className="text-text-secondary text-sm mb-2">Magic link sent to</p>
                                    <p className="text-brand-accent font-medium text-sm mb-6">{email}</p>
                                    <button onClick={() => { setStep('input'); setEmail('') }} className="text-text-muted text-xs hover:text-text-secondary transition-colors">
                                        Use a different email
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Builder login link */}
                    <div className="text-center mt-6">
                        <Link href="/builder-login" className="inline-flex items-center gap-1 text-text-muted text-xs hover:text-text-secondary transition-colors">
                            <Shield size={12} />Builder Admin Login<ChevronRight size={12} />
                        </Link>
                    </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="mt-10 flex items-center gap-6 text-text-muted text-xs">
                    <span className="flex items-center gap-1"><Shield size={12} /> RERA Compliant</span>
                    <span className="w-px h-3 bg-surface-border" />
                    <span>🔒 256-bit SSL</span>
                    <span className="w-px h-3 bg-surface-border" />
                    <span>🇮🇳 Made for India</span>
                </motion.div>
            </div>
        </div>
    )
}
