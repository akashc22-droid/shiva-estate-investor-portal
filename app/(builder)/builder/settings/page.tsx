'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Upload, Building2 } from 'lucide-react'

export default function BuilderSettingsPage() {
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        name: 'ShivaOS Realty',
        tagline: 'Your Investment. Your Transparency.',
        email: 'invest@shivaos.com',
        phone: '+91 40 4567 8900',
        reraId: 'A01600000001',
        primaryColor: '#C9A84C',
        subdomain: 'shivaos',
    })

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">White-Label Settings</h1>
                <p className="text-text-muted text-sm mt-1">Customize the investor-facing portal branding</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
                {/* Logo upload */}
                <div className="card p-5">
                    <h2 className="text-text-primary font-semibold mb-4">Brand Identity</h2>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border-2 border-brand-accent/30 flex items-center justify-center">
                            <Building2 size={24} className="text-brand-accent" />
                        </div>
                        <div>
                            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-dark border border-surface-border text-text-secondary text-sm hover:text-text-primary transition-colors">
                                <Upload size={14} />
                                Upload Logo
                            </button>
                            <p className="text-text-muted text-xs mt-1">PNG or SVG, min 200×200px</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-text-secondary mb-1.5 block">Company Name</label>
                            <input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-brand-accent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary mb-1.5 block">Tagline</label>
                            <input
                                value={form.tagline}
                                onChange={e => setForm({ ...form, tagline: e.target.value })}
                                className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-brand-accent transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="card p-5">
                    <h2 className="text-text-primary font-semibold mb-4">Brand Colors</h2>
                    <div>
                        <label className="text-xs text-text-secondary mb-1.5 block">Accent Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={form.primaryColor}
                                onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                                className="w-10 h-10 rounded-xl border border-surface-border bg-surface-dark cursor-pointer"
                            />
                            <input
                                value={form.primaryColor}
                                onChange={e => setForm({ ...form, primaryColor: e.target.value })}
                                className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm font-mono focus:border-brand-accent transition-colors"
                            />
                        </div>
                        <div className="mt-3 h-8 rounded-xl" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.primaryColor}80)` }} />
                    </div>
                </div>

                {/* Contact */}
                <div className="card p-5">
                    <h2 className="text-text-primary font-semibold mb-4">Contact Details</h2>
                    <div className="space-y-3">
                        {[
                            { key: 'email', label: 'Contact Email', placeholder: 'invest@company.com' },
                            { key: 'phone', label: 'Contact Phone', placeholder: '+91 00000 00000' },
                            { key: 'reraId', label: 'RERA Registration ID', placeholder: 'A01600000001' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-xs text-text-secondary mb-1.5 block">{f.label}</label>
                                <input
                                    value={form[f.key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-brand-accent transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom domain */}
                <div className="card p-5">
                    <h2 className="text-text-primary font-semibold mb-1">Custom Domain</h2>
                    <p className="text-text-muted text-xs mb-4">Your investor portal will be available at this URL</p>
                    <div className="flex items-center gap-2">
                        <input
                            value={form.subdomain}
                            onChange={e => setForm({ ...form, subdomain: e.target.value })}
                            className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm font-mono focus:border-brand-accent transition-colors"
                        />
                        <span className="text-text-muted text-sm">.yourplatform.com</span>
                    </div>
                    <p className="text-text-muted text-xs mt-2">Full custom domain configuration available in the production plan.</p>
                </div>

                <motion.button
                    type="submit"
                    disabled={saving}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-semibold py-3 rounded-xl hover:bg-brand-accent-light transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </form>
        </div>
    )
}
