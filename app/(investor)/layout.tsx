'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, FileText, TrendingUp, Bell } from 'lucide-react'
import { cn } from '@/lib/utils/format'

const NAV_ITEMS = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/projects', icon: FolderOpen, label: 'Projects' },
    { href: '/documents', icon: FileText, label: 'Docs' },
    { href: '/returns', icon: TrendingUp, label: 'Returns' },
    { href: '/notifications', icon: Bell, label: 'Alerts' },
]

export default function InvestorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col">
            {/* Desktop sidebar (hidden on mobile) */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-surface-card border-r border-surface-border flex-col z-40">
                {/* Logo */}
                <div className="p-5 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center">
                            <span className="font-display font-bold text-brand-accent text-sm">SE</span>
                        </div>
                        <div>
                            <p className="text-text-primary font-semibold text-sm">Shiva Estate</p>
                            <p className="text-text-muted text-xs">Investor Portal</p>
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                                    active
                                        ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                )}
                            >
                                <item.icon size={17} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Gold accent strip */}
                <div className="h-1 w-full bg-gold-gradient opacity-30" />
            </aside>

            {/* Main content area */}
            <main className="lg:ml-60 flex-1 pb-24 lg:pb-0">
                {children}
            </main>

            {/* Mobile bottom navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-card/90 backdrop-blur-xl border-t border-surface-border z-50 pb-safe">
                <div className="flex items-center justify-around px-2 pt-2 pb-2">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[44px]',
                                    active ? 'text-brand-accent' : 'text-text-muted'
                                )}
                            >
                                <item.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
