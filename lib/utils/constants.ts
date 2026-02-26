export const BRAND = {
    name: 'ShivaOS Investor Portal',
    tagline: 'Your Investment. Your Transparency.',
    builderName: 'ShivaOS Realty',
    subdomain: 'shivaos',
    primaryColor: '#C9A84C',
    navyColor: '#1A1A2E',
} as const

export const COLORS = {
    brandPrimary: '#1A1A2E',
    brandAccent: '#C9A84C',
    brandAccentLight: '#F0D080',
    surfaceDark: '#0F0F1A',
    surfaceCard: '#1E1E35',
    surfaceBorder: '#2A2A4A',
    textPrimary: '#F0EDE8',
    textSecondary: '#9B9BB0',
    textMuted: '#5A5A75',
    statusGreen: '#2ECC71',
    statusAmber: '#F39C12',
    statusRed: '#E74C3C',
} as const

export const IST_TIMEZONE = 'Asia/Kolkata'

export const PAYMENT_MODES = ['NEFT', 'UPI', 'Cheque', 'DD', 'RTGS'] as const

export const PROJECT_STATUS_LABELS: Record<string, string> = {
    UPCOMING: 'Upcoming',
    LAUNCHED: 'Launched',
    UNDER_CONSTRUCTION: 'Under Construction',
    NEAR_COMPLETION: 'Near Completion',
    COMPLETED: 'Completed',
    DELAYED: 'Delayed',
}

export const INVESTMENT_STATUS_LABELS: Record<string, string> = {
    BOOKED: 'Booked',
    AGREEMENT_SIGNED: 'Agreement Signed',
    UNDER_CONSTRUCTION: 'Under Construction',
    READY_FOR_POSSESSION: 'Ready for Possession',
    POSSESSION_GIVEN: 'Possession Given',
    REGISTERED: 'Registered',
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
    ALLOTMENT_LETTER: 'Allotment Letter',
    SALE_AGREEMENT: 'Sale Agreement',
    PAYMENT_RECEIPT: 'Payment Receipt',
    DEMAND_NOTICE: 'Demand Notice',
    OC_CERTIFICATE: 'OC Certificate',
    CC_CERTIFICATE: 'CC Certificate',
    RERA_REGISTRATION: 'RERA Registration',
    FLOOR_PLAN: 'Floor Plan',
    BROCHURE: 'Brochure',
    NOC: 'NOC',
    POSSESSION_LETTER: 'Possession Letter',
    REGISTRATION_DEED: 'Registration Deed',
    OTHER: 'Other',
}

export const NOTIFICATION_TYPE_ICONS: Record<string, string> = {
    UPDATE: '🏗️',
    PAYMENT_DUE: '💰',
    MILESTONE_REACHED: '🏆',
    DOCUMENT_UPLOADED: '📄',
    RERA_ALERT: '⚠️',
    AI_INSIGHT: '🤖',
}
