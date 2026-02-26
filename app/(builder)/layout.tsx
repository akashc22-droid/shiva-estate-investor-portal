'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, FileText, Settings, Building2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils/format'

const NAV_ITEMS = [
    { href: '/builder/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/builder/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/builder/investors', icon: Users, label: 'Investors' },
    { href: '/builder/documents', icon: FileText, label: 'Documents' },
    { href: '/builder/settings', icon: Settings, label: 'Settings' },
]

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-surface-dark flex">
            {/* Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-surface-card border-r border-surface-border flex-col z-40">
                {/* Logo */}
                <div className="p-5 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                        <Building2 size={20} className="text-brand-accent" />
                        <div>
                            <p className="text-text-primary font-semibold text-sm">ShivaOS Realty</p>
                            <p className="text-text-muted text-[10px]">Admin Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all',
                                    active
                                        ? 'bg-brand-accent/10 text-brand-accent'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                )}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-3 border-t border-surface-border">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-status-red hover:bg-status-red/5 transition-all">
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-surface-card border-b border-surface-border z-40 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-brand-accent" />
                    <span className="text-text-primary font-semibold text-sm">Builder Admin</span>
                </div>
                <div className="flex gap-1">
                    {NAV_ITEMS.slice(0, 4).map((item) => (
                        <Link key={item.href} href={item.href} className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
                            <item.icon size={17} />
                        </Link>
                    ))}
                </div>
            </div>

            <main className="md:ml-56 flex-1 pt-14 md:pt-0">{children}</main>
        </div>
    )
}
