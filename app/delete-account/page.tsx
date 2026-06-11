'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Loader2, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react'

type State = 'idle' | 'confirm' | 'deleting' | 'done' | 'error'

export default function DeleteAccountPage() {
    const router = useRouter()
    const [state, setState] = useState<State>('idle')
    const [message, setMessage] = useState('')

    async function handleDelete() {
        setState('deleting')
        setMessage('')
        try {
            const res = await fetch('/api/auth/delete-account', { method: 'POST' })
            const data = await res.json()
            if (!res.ok) {
                setState('error')
                setMessage(data?.error ?? 'Something went wrong. Please contact support.')
                return
            }
            setState('done')
            setMessage(data?.message ?? 'Your account and all associated data have been permanently deleted.')
            setTimeout(() => router.push('/login'), 3500)
        } catch {
            setState('error')
            setMessage('Network error. Please check your connection and try again.')
        }
    }

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col items-center justify-center px-5 py-12">
            <div className="w-full max-w-md">
                <Link href="/dashboard" className="inline-flex items-center gap-1 text-text-muted text-xs mb-6 hover:text-text-secondary transition-colors">
                    <ArrowLeft size={14} /> Back to portal
                </Link>

                <div className="card p-6 md:p-8">
                    <div className="w-14 h-14 rounded-2xl bg-status-red/10 border border-status-red/20 flex items-center justify-center mb-5">
                        <Trash2 size={24} className="text-status-red" />
                    </div>

                    <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Delete your account</h1>
                    <p className="text-text-secondary text-sm mb-6">
                        This permanently removes your Shiva Estate Investor Portal account and all data
                        associated with it. This action cannot be undone.
                    </p>

                    <div className="bg-surface-dark border border-surface-border rounded-xl p-4 mb-6">
                        <p className="text-text-secondary text-xs font-medium mb-2">What gets deleted:</p>
                        <ul className="text-text-muted text-xs space-y-1.5 list-disc list-inside">
                            <li>Your profile (name, email, phone, KYC references)</li>
                            <li>Your investment, unit and payment records</li>
                            <li>Your documents and notifications</li>
                            <li>Your login credentials</li>
                        </ul>
                        <p className="text-text-muted text-[11px] mt-3">
                            Note: records your builder is legally required to retain (e.g. RERA / tax
                            filings) may be kept by the builder independently of your portal account.
                        </p>
                    </div>

                    {state === 'done' ? (
                        <div className="flex items-start gap-3 bg-status-green/5 border border-status-green/20 rounded-xl px-4 py-3">
                            <CheckCircle size={18} className="text-status-green flex-shrink-0 mt-0.5" />
                            <p className="text-text-secondary text-sm">{message}</p>
                        </div>
                    ) : state === 'idle' ? (
                        <button
                            onClick={() => setState('confirm')}
                            className="w-full flex items-center justify-center gap-2 bg-status-red/90 text-white font-semibold py-3 rounded-xl hover:bg-status-red transition-colors"
                        >
                            Delete my account
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-start gap-2 bg-status-amber/5 border border-status-amber/20 rounded-xl px-4 py-3">
                                <AlertTriangle size={16} className="text-status-amber flex-shrink-0 mt-0.5" />
                                <p className="text-text-secondary text-xs">Are you absolutely sure? This is permanent.</p>
                            </div>
                            {state === 'error' && <p className="text-status-red text-xs">{message}</p>}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setState('idle')}
                                    disabled={state === 'deleting'}
                                    className="flex-1 border border-surface-border text-text-secondary py-3 rounded-xl text-sm hover:bg-surface-hover transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={state === 'deleting'}
                                    className="flex-1 flex items-center justify-center gap-2 bg-status-red/90 text-white font-semibold py-3 rounded-xl hover:bg-status-red transition-colors disabled:opacity-50"
                                >
                                    {state === 'deleting' ? <Loader2 size={16} className="animate-spin" /> : null}
                                    Yes, delete
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="text-text-muted text-[11px] text-center mt-6">
                        Prefer to delete via email? Write to{' '}
                        <a href="mailto:privacy@shivaestate.com" className="text-brand-accent">privacy@shivaestate.com</a>{' '}
                        and we will remove your account within 30 days.
                    </p>
                </div>

                <p className="text-center mt-6">
                    <Link href="/privacy" className="text-text-muted text-xs hover:text-text-secondary transition-colors">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    )
}
