'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Save, Loader2, Upload, Building2, Lock, Zap,
    Globe, Eye, Sparkles, Shield, Info,
} from 'lucide-react'

// ─── Tier badge helper ─────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: string }) {
    const styles: Record<string, string> = {
        STARTER: 'bg-surface-dark text-text-muted border border-surface-border',
        GROWTH: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        ENTERPRISE: 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20',
    }
    return (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${styles[tier] ?? styles.STARTER}`}>
            {tier}
        </span>
    )
}

// ─── Tooltip wrapper ───────────────────────────────────────────────────────────
function UpgradeTooltip({ children, message }: { children: React.ReactNode; message: string }) {
    const [show, setShow] = useState(false)
    return (
        <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 bg-surface-card border border-surface-border rounded-xl p-3 text-xs text-text-secondary shadow-card z-50 text-center"
                    >
                        <Zap size={12} className="text-brand-accent mx-auto mb-1" />
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Live preview panel ────────────────────────────────────────────────────────
function LivePreview({ form }: { form: FormState }) {
    // Blend primary + accent to create a mock gradient
    const gradStyle = {
        background: `linear-gradient(135deg, ${form.accentColor}22 0%, #0F0F1A 60%)`,
    }
    const accentRing = { borderColor: form.primaryColor }
    const accentText = { color: form.primaryColor }

    return (
        <div className="card overflow-hidden">
            {/* Preview header */}
            <div className="px-5 pt-4 pb-3 border-b border-surface-border flex items-center gap-2">
                <Eye size={14} className="text-brand-accent" />
                <p className="text-text-primary text-sm font-semibold">Live Preview</p>
                <span className="ml-auto text-[10px] text-text-muted bg-surface-dark border border-surface-border rounded-full px-2 py-0.5">Investor Login</span>
            </div>

            {/* Mock investor login screen */}
            <div className="p-5">
                <div
                    className="rounded-2xl border border-surface-border overflow-hidden"
                    style={gradStyle}
                >
                    <div className="p-6 flex flex-col items-center text-center gap-3">
                        {/* Logo placeholder */}
                        <div
                            className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center"
                            style={accentRing}
                        >
                            <span className="font-display font-bold text-lg" style={accentText}>
                                {form.name.slice(0, 2).toUpperCase()}
                            </span>
                        </div>

                        {/* Name + tagline */}
                        <div>
                            <p className="text-text-primary font-semibold text-sm">{form.name || 'Builder Name'}</p>
                            {form.tagline && (
                                <p className="text-text-muted text-xs mt-0.5">{form.tagline}</p>
                            )}
                        </div>

                        {/* Mock "Investor Login" input */}
                        <div className="w-full space-y-2 mt-1">
                            <div className="w-full h-7 rounded-lg bg-surface-card/60 border border-surface-border" />
                            <div className="w-full h-7 rounded-lg bg-surface-card/60 border border-surface-border" />
                            <div
                                className="w-full h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold mt-1"
                                style={{ background: form.primaryColor, color: form.accentColor === '#1A1A2E' ? '#0F0F1A' : '#fff' }}
                            >
                                Sign In
                            </div>
                        </div>

                        {/* Dual-color gradient swatch */}
                        <div className="flex gap-2 w-full mt-1">
                            <div className="h-5 flex-1 rounded-lg" style={{ background: form.primaryColor }} />
                            <div className="h-5 flex-1 rounded-lg" style={{ background: form.accentColor }} />
                        </div>

                        {/* Powered by badge (if enabled) */}
                        {form.showPoweredBy && (
                            <div className="flex items-center gap-1 bg-black/30 backdrop-blur rounded-full px-2.5 py-1 border border-white/[0.06]">
                                <span className="text-[9px] text-white/40 uppercase tracking-wide">Powered by</span>
                                <span className="text-[10px] text-white/70 font-semibold">Artha</span>
                                <span className="w-1 h-1 rounded-full bg-brand-accent" />
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-text-muted text-[10px] text-center mt-3">
                    Preview updates as you type — actual portal may vary
                </p>
            </div>
        </div>
    )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

interface FormState {
    name: string
    tagline: string
    email: string
    phone: string
    reraId: string
    primaryColor: string
    accentColor: string
    subdomain: string
    customDomain: string
    showPoweredBy: boolean
}

type BuilderTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE'
const DEMO_TIER: BuilderTier = 'STARTER' // In production, read from BuilderBrand/DB

export default function BuilderSettingsPage() {
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState<FormState>({
        name: 'Shiva Estate',
        tagline: 'Shiva Buildcon · Shiva Investments',
        email: 'invest@shivaestate.com',
        phone: '+91 755 4567 8900',
        reraId: 'A01600000001',
        primaryColor: '#C9A84C',
        accentColor: '#1A1A2E',
        subdomain: 'shivaos',
        customDomain: '',
        showPoweredBy: true,
    })

    const isStarter = DEMO_TIER === 'STARTER'
    const isEnterprise = DEMO_TIER === 'ENTERPRISE'

    const set = (k: keyof FormState, v: string | boolean) =>
        setForm(prev => ({ ...prev, [k]: v }))

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="max-w-5xl mx-auto px-5 py-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">White-Label Settings</h1>
                    <p className="text-text-muted text-sm mt-1">Customize the investor-facing portal branding</p>
                </div>
                <TierBadge tier={DEMO_TIER} />
            </div>

            {/* Two-column layout on desktop: form left, preview right */}
            <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
                {/* ── Left: settings form ── */}
                <form onSubmit={handleSave} className="space-y-5">

                    {/* Brand Identity */}
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
                                    onChange={e => set('name', e.target.value)}
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-brand-accent transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary mb-1.5 block">
                                    Tagline
                                    <span className="ml-2 text-text-muted">— shown on investor login screen</span>
                                </label>
                                <input
                                    value={form.tagline}
                                    onChange={e => set('tagline', e.target.value)}
                                    placeholder="e.g. Your Investment. Your Transparency."
                                    className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-brand-accent transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Brand Colors */}
                    <div className="card p-5">
                        <h2 className="text-text-primary font-semibold mb-4">Brand Colors</h2>
                        <div className="space-y-4">
                            {/* Primary color */}
                            <div>
                                <label className="text-xs text-text-secondary mb-1.5 block">Primary Color <span className="text-text-muted">— buttons, accents, active states</span></label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.primaryColor}
                                        onChange={e => set('primaryColor', e.target.value)}
                                        className="w-10 h-10 rounded-xl border border-surface-border bg-surface-dark cursor-pointer"
                                    />
                                    <input
                                        value={form.primaryColor}
                                        onChange={e => set('primaryColor', e.target.value)}
                                        maxLength={7}
                                        className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm font-mono focus:border-brand-accent transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Accent / background color — NEW */}
                            <div>
                                <label className="text-xs text-text-secondary mb-1.5 block">Accent Color <span className="text-text-muted">— background tones, sidebar</span></label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.accentColor}
                                        onChange={e => set('accentColor', e.target.value)}
                                        className="w-10 h-10 rounded-xl border border-surface-border bg-surface-dark cursor-pointer"
                                    />
                                    <input
                                        value={form.accentColor}
                                        onChange={e => set('accentColor', e.target.value)}
                                        maxLength={7}
                                        className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm font-mono focus:border-brand-accent transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Combined gradient preview swatch */}
                            <div
                                className="h-10 rounded-xl"
                                style={{ background: `linear-gradient(135deg, ${form.accentColor}, ${form.primaryColor})` }}
                            />
                        </div>
                    </div>

                    {/* Contact Details */}
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
                                        value={form[f.key as keyof typeof form] as string}
                                        onChange={e => set(f.key as keyof FormState, e.target.value)}
                                        placeholder={f.placeholder}
                                        className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:border-brand-accent transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform Settings */}
                    <div className="card p-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-brand-accent" />
                            <h2 className="text-text-primary font-semibold">Artha Platform Settings</h2>
                        </div>
                        <p className="text-text-muted text-xs mb-4">Controls how your portal appears on the Artha platform</p>

                        <div className="space-y-4">
                            {/* Subdomain */}
                            <div>
                                <label className="text-xs text-text-secondary mb-1.5 block">Subdomain</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        value={form.subdomain}
                                        onChange={e => set('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="flex-1 bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-text-primary text-sm font-mono focus:border-brand-accent transition-colors"
                                    />
                                    <span className="text-text-muted text-sm whitespace-nowrap">.artha.io</span>
                                </div>
                                <p className="text-text-muted text-xs mt-1.5">
                                    Your portal URL: <span className="font-mono text-brand-accent">{form.subdomain}.artha.io</span>
                                </p>
                            </div>

                            {/* Custom domain — NEW, locked for non-Enterprise */}
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <label className="text-xs text-text-secondary">Custom Domain</label>
                                    {!isEnterprise && (
                                        <span className="flex items-center gap-1 text-[10px] text-text-muted bg-surface-dark border border-surface-border rounded-full px-2 py-0.5">
                                            <Lock size={9} />
                                            Enterprise
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        value={form.customDomain}
                                        onChange={e => isEnterprise && set('customDomain', e.target.value)}
                                        readOnly={!isEnterprise}
                                        placeholder="invest.yourcompany.com"
                                        className={`w-full bg-surface-dark border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono transition-colors ${isEnterprise
                                            ? 'text-text-primary focus:border-brand-accent cursor-text'
                                            : 'text-text-muted cursor-not-allowed opacity-60'
                                            }`}
                                    />
                                </div>
                                <div className="flex items-start gap-1.5 mt-2">
                                    <Info size={11} className="text-text-muted mt-0.5 flex-shrink-0" />
                                    <p className="text-text-muted text-[11px]">
                                        Custom domain is available on the{' '}
                                        <span className="text-brand-accent font-medium">Enterprise plan</span>.
                                        {' '}Allows serving your portal at <span className="font-mono">invest.yourcompany.com</span>.
                                    </p>
                                </div>
                            </div>

                            {/* "Powered by Artha" toggle — NEW, locked ON for STARTER */}
                            <div className="pt-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-text-secondary text-sm font-medium">&quot;Powered by Artha&quot; Badge</p>
                                        <p className="text-text-muted text-xs mt-0.5">
                                            Shows a small floating badge on the investor portal
                                        </p>
                                    </div>
                                    {isStarter ? (
                                        <UpgradeTooltip message="Upgrade to Growth or Enterprise to hide the Artha badge">
                                            <div className="flex items-center gap-2 opacity-60 cursor-not-allowed">
                                                <Lock size={12} className="text-text-muted" />
                                                <div className="w-10 h-6 rounded-full bg-brand-accent flex items-center justify-end pr-1">
                                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                                </div>
                                            </div>
                                        </UpgradeTooltip>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => set('showPoweredBy', !form.showPoweredBy)}
                                            className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.showPoweredBy ? 'bg-brand-accent justify-end' : 'bg-surface-border justify-start'
                                                }`}
                                        >
                                            <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-all" />
                                        </button>
                                    )}
                                </div>

                                {isStarter && (
                                    <div className="mt-2 flex items-center gap-2 bg-brand-accent/5 border border-brand-accent/15 rounded-xl px-3 py-2">
                                        <Shield size={12} className="text-brand-accent flex-shrink-0" />
                                        <p className="text-[11px] text-text-muted">
                                            On STARTER plan the badge is always visible.{' '}
                                            <span className="text-brand-accent font-medium cursor-pointer hover:underline">Upgrade to Growth →</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save button */}
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

                {/* ── Right: live preview (sticky on desktop) ── */}
                <div className="lg:sticky lg:top-6">
                    <LivePreview form={form} />
                </div>
            </div>
        </div>
    )
}
