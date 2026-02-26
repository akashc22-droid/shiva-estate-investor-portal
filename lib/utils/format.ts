/**
 * Currency, date, and number formatters for INR / Indian locale
 */

// ─── Currency (INR with Indian numbering: lakhs/crores) ───────────────────────

export function formatINR(amount: number, compact = false): string {
    if (compact) {
        if (amount >= 10_000_000) {
            return `₹${(amount / 10_000_000).toFixed(2)} Cr`
        }
        if (amount >= 100_000) {
            return `₹${(amount / 100_000).toFixed(2)} L`
        }
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatCrore(crores: number): string {
    if (crores >= 1) {
        return `₹${crores.toFixed(0)} Cr`
    }
    return `₹${(crores * 100).toFixed(0)} L`
}

export function formatLakh(amount: number): string {
    const lakhs = amount / 100_000
    if (lakhs >= 100) {
        return `₹${(amount / 10_000_000).toFixed(2)} Cr`
    }
    return `₹${lakhs.toFixed(2)} L`
}

// ─── Date formatting (Indian format: "15 Mar 2026") ───────────────────────────

export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return '—'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    })
}

export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
}

// ─── Percentage ───────────────────────────────────────────────────────────────

export function formatPercent(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`
}

// ─── Classname utility ────────────────────────────────────────────────────────

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
