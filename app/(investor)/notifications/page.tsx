'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCheck, Bell } from 'lucide-react'

const DEMO_NOTIFICATIONS = [
    {
        id: '1',
        type: 'PAYMENT_DUE',
        icon: '💰',
        title: 'Payment Due: ₹20L by 28 Feb 2026',
        body: 'Your 10th Floor Slab milestone payment of ₹20,00,000 is due on 28 February 2026 for Unit A-1204, ShivaOS Skyline.',
        time: '25 days ago',
        isRead: false,
        color: 'border-status-amber/30 bg-status-amber/5',
    },
    {
        id: '2',
        type: 'AI_INSIGHT',
        icon: '🤖',
        title: 'AI Insight: Strong appreciation in Kokapet',
        body: 'Your unit A-1204 is projected to appreciate 18–22% by possession. Confidence: High (82%). Full analysis available.',
        time: '12 days ago',
        isRead: false,
        color: 'border-brand-accent/20 bg-brand-accent/5',
    },
    {
        id: '3',
        type: 'UPDATE',
        icon: '🏗️',
        title: 'Construction Update — February 2026',
        body: 'ShivaOS Skyline is at 68% completion. Tower A has reached the 19th floor. Possession on track for March 2026.',
        time: '12 days ago',
        isRead: true,
        color: '',
    },
    {
        id: '4',
        type: 'RERA_ALERT',
        icon: '✅',
        title: 'RERA Q3 Compliance Filed — 94/100',
        body: "ShivaOS Skyline's Q3 RERA compliance has been filed with a score of 94/100. No pending notices.",
        time: '42 days ago',
        isRead: true,
        color: '',
    },
    {
        id: '5',
        type: 'MILESTONE_REACHED',
        icon: '🏆',
        title: 'Milestone: 11th–15th Floors Complete!',
        body: 'The 11th to 15th floor slabs for ShivaOS Skyline have been successfully completed ahead of schedule.',
        time: '3 months ago',
        isRead: true,
        color: '',
    },
]

const TYPE_COLORS: Record<string, string> = {
    PAYMENT_DUE: 'text-status-amber',
    AI_INSIGHT: 'text-brand-accent',
    UPDATE: 'text-status-blue',
    RERA_ALERT: 'text-status-green',
    MILESTONE_REACHED: 'text-status-green',
    DOCUMENT_UPLOADED: 'text-text-secondary',
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)
    const unreadCount = notifications.filter(n => !n.isRead).length

    function markAllRead() {
        setNotifications(n => n.map(item => ({ ...item, isRead: true })))
    }

    return (
        <div className="max-w-3xl mx-auto px-5 py-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Notifications</h1>
                    {unreadCount > 0 && (
                        <p className="text-text-muted text-sm mt-1">{unreadCount} unread</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 text-brand-accent text-sm hover:text-brand-accent-light transition-colors"
                    >
                        <CheckCheck size={15} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notification list */}
            <div className="space-y-2">
                {notifications.map((n, i) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setNotifications(prev =>
                            prev.map(item => item.id === n.id ? { ...item, isRead: true } : item)
                        )}
                        className={`card p-4 flex items-start gap-3 cursor-pointer hover:border-surface-hover transition-all ${!n.isRead ? n.color || 'border-surface-border' : ''
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${!n.isRead ? 'bg-surface-dark' : 'bg-surface-dark/50'}`}>
                            {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-medium leading-snug ${n.isRead ? 'text-text-secondary' : 'text-text-primary'}`}>
                                    {n.title}
                                </p>
                                {!n.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0 mt-1" />
                                )}
                            </div>
                            <p className="text-text-muted text-xs mt-1 leading-relaxed line-clamp-2">{n.body}</p>
                            <p className="text-text-muted text-[10px] mt-1.5">{n.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {notifications.every(n => n.isRead) && (
                <div className="card p-10 text-center">
                    <Bell size={28} className="text-text-muted mx-auto mb-3" />
                    <p className="text-text-secondary font-medium">All caught up!</p>
                    <p className="text-text-muted text-sm mt-1">No unread notifications</p>
                </div>
            )}
        </div>
    )
}
