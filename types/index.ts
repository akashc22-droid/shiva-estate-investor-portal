// Global TypeScript types for the Investor Portal MVP

export type {
    Builder,
    BuilderUser,
    BuilderRole,
    Project,
    ProjectStatus,
    ProjectType,
    Floor,
    Unit,
    UnitStatus,
    Investor,
    Investment,
    InvestmentStatus,
    Payment,
    Milestone,
    MilestoneStatus,
    ProjectUpdate,
    UpdateType,
    Document,
    DocumentType,
    Notification,
    NotificationType,
} from '@prisma/client'

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
    data: T | null
    error: string | null
    success: boolean
}

// ─── Extended / Joined Types ──────────────────────────────────────────────────

export interface InvestorWithInvestments {
    id: string
    name: string
    email: string
    phone: string | null
    isNRI: boolean
    country: string | null
    investments: InvestmentWithProject[]
}

export interface InvestmentWithProject {
    id: string
    bookingAmount: number
    totalAgreedAmount: number
    totalPaid: number
    pendingAmount: number
    predictedReturnPct: number | null
    predictedReturnRange: string | null
    confidenceScore: number | null
    status: string
    possessionDate: Date | null
    project: {
        id: string
        name: string
        city: string
        overallProgress: number
        status: string
        thumbnailUrl: string | null
        expectedCompletion: Date | null
    }
    unit: {
        unitNumber: string
        type: string
        carpetArea: number
    } | null
    payments: PaymentSummary[]
}

export interface PaymentSummary {
    id: string
    amount: number
    paidAt: Date
    mode: string
    referenceNo: string | null
}

export interface ProjectWithDetails {
    id: string
    name: string
    description: string | null
    location: string
    city: string
    state: string
    reraNumber: string | null
    totalUnits: number
    totalProjectValue: number
    totalFundingTarget: number
    fundingRaised: number
    overallProgress: number
    status: string
    projectType: string
    thumbnailUrl: string | null
    expectedCompletion: Date | null
    milestones: MilestoneSummary[]
    updates: UpdateSummary[]
}

export interface MilestoneSummary {
    id: string
    name: string
    description: string | null
    targetDate: Date
    actualDate: Date | null
    progress: number
    status: string
    order: number
}

export interface UpdateSummary {
    id: string
    title: string
    body: string
    photoUrls: string[]
    updateType: string
    publishedAt: Date | null
    aiGenerated: boolean
}

// ─── UI / Component Types ─────────────────────────────────────────────────────

export interface BrandConfig {
    name: string
    logoUrl: string | null
    primaryColor: string
    subdomain: string
    contactEmail: string
    contactPhone: string | null
}

export interface RERAStatus {
    isRegistered: boolean
    lastUpdated: string
    complianceScore: number
    pendingFilings: string[]
    projectStatus: string
}

export interface AIReturnPrediction {
    investedAmount: number
    currentMarketValue: number
    unrealisedGainPct: number
    projectedValueMin: number
    projectedValueMax: number
    irrMin: number
    irrMax: number
    confidenceScore: number
    reasoning: string
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type InvestorNavTab = 'dashboard' | 'projects' | 'documents' | 'returns' | 'notifications'
export type BuilderNavTab = 'dashboard' | 'projects' | 'investors' | 'documents' | 'settings'
