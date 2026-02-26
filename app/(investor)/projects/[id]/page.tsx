import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import { ProjectDetailClient } from './ProjectDetailClient'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: { id: string }
}

async function getProject(id: string) {
    try {
        return await prisma.project.findUnique({
            where: { id },
            include: {
                milestones: { orderBy: { order: 'asc' } },
                updates: {
                    where: { isPublished: true },
                    orderBy: { publishedAt: 'desc' },
                },
                documents: { where: { isVisibleToInvestor: true }, orderBy: { createdAt: 'desc' } },
                investments: {
                    include: {
                        investor: true,
                        unit: true,
                        payments: { orderBy: { paidAt: 'asc' } },
                    },
                },
            },
        })
    } catch {
        return null
    }
}


export default async function ProjectDetailPage({ params }: PageProps) {
    // Handle demo IDs
    if (params.id.startsWith('demo-')) {
        const demoData = params.id === 'demo-pinaki' ? DEMO_PROJECT_PINAKI : DEMO_PROJECT
        return <ProjectDetailClient project={demoData} />
    }

    const project = await getProject(params.id)
    if (!project) notFound()
    return <ProjectDetailClient project={project} />
}

const DEMO_PROJECT = {
    id: 'demo-sankhedi',
    name: 'Sankhedi Project',
    description: 'A premium residential plotted development by Shiva Buildcon, strategically located on Kolar Road near SAGE International School — one of Bhopal\'s fastest-growing corridors with excellent connectivity to the city center.',
    location: 'Kolar Road, Near SAGE International School',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    reraNumber: 'P4500012345',
    reraState: 'MP',
    totalUnits: 48,
    totalProjectValue: 45,
    totalFundingTarget: 40,
    fundingRaised: 32,
    overallProgress: 55,
    status: 'UNDER_CONSTRUCTION',
    projectType: 'PLOTTED_DEVELOPMENT',
    expectedCompletion: new Date('2026-12-31'),
    thumbnailUrl: null,
    latitude: 23.1766,
    longitude: 77.4379,
    milestones: [
        { id: '1', name: 'Land Acquisition & Boundary Wall', targetDate: new Date('2024-03-31'), actualDate: new Date('2024-03-20'), progress: 100, status: 'COMPLETED', order: 1, description: 'Plot demarcation and perimeter secured.', createdAt: new Date() },
        { id: '2', name: 'Site Levelling & Layout', targetDate: new Date('2024-06-30'), actualDate: new Date('2024-06-15'), progress: 100, status: 'COMPLETED', order: 2, description: 'Full topographic survey and plot layout done.', createdAt: new Date() },
        { id: '3', name: 'Internal Roads & Drainage', targetDate: new Date('2024-10-31'), actualDate: new Date('2024-10-28'), progress: 100, status: 'COMPLETED', order: 3, description: 'All internal CC roads and storm drains laid.', createdAt: new Date() },
        { id: '4', name: 'Underground Utilities', targetDate: new Date('2025-02-28'), actualDate: null, progress: 70, status: 'IN_PROGRESS', order: 4, description: 'Water line 85% done, electrical conduits 55% done.', createdAt: new Date() },
        { id: '5', name: 'Landscaping & Common Areas', targetDate: new Date('2025-08-31'), actualDate: null, progress: 0, status: 'UPCOMING', order: 5, description: null, createdAt: new Date() },
        { id: '6', name: 'Registry & Possession', targetDate: new Date('2026-12-31'), actualDate: null, progress: 0, status: 'UPCOMING', order: 6, description: null, createdAt: new Date() },
    ],
    updates: [
        {
            id: 'u1',
            title: 'Site Update — February 2026',
            body: '**Sankhedi Project** is progressing well at **55% completion**. Underground utility work is 70% done. Internal CC roads are complete and accessible.',
            photoUrls: [],
            updateType: 'CONSTRUCTION',
            isPublished: true,
            publishedAt: new Date('2026-02-20'),
            aiGenerated: false,
            projectId: 'demo-sankhedi',
            createdAt: new Date(),
        },
    ],
    documents: [
        { id: 'd1', name: 'Sankhedi Project — RERA Certificate', documentType: 'RERA_REGISTRATION', fileUrl: '#', fileSize: 180000, mimeType: 'application/pdf', uploadedBy: 'builder', isVisibleToInvestor: true, investorId: null, projectId: 'demo-sankhedi', builderId: null, aiCategory: null, aiExtractedData: null, createdAt: new Date() },
        { id: 'd2', name: 'Layout Plan — Sankhedi Project', documentType: 'FLOOR_PLAN', fileUrl: '#', fileSize: 3200000, mimeType: 'application/pdf', uploadedBy: 'builder', isVisibleToInvestor: true, investorId: null, projectId: 'demo-sankhedi', builderId: null, aiCategory: null, aiExtractedData: null, createdAt: new Date() },
        { id: 'd3', name: 'Allotment Letter — Plot SP-07', documentType: 'ALLOTMENT_LETTER', fileUrl: '#', fileSize: 245000, mimeType: 'application/pdf', uploadedBy: 'builder', isVisibleToInvestor: true, investorId: null, projectId: 'demo-sankhedi', builderId: null, aiCategory: null, aiExtractedData: null, createdAt: new Date() },
    ],
    investments: [
        {
            id: 'inv1',
            investorId: 'demo-investor',
            investor: { name: 'Rajesh Sharma', email: 'rajesh@gmail.com' },
            unit: { unitNumber: 'SP-07', type: 'Residential Plot', carpetArea: 1800, price: 7500000, status: 'BOOKED' },
            bookingAmount: 375000,
            totalAgreedAmount: 7500000,
            totalPaid: 4500000,
            pendingAmount: 3000000,
            agreementDate: new Date('2024-04-10'),
            agreementNumber: 'SB/SKP/2024/0107',
            possessionDate: new Date('2026-12-31'),
            predictedReturnPct: 16.5,
            predictedReturnRange: '14–20%',
            confidenceScore: 0.80,
            status: 'UNDER_CONSTRUCTION',
            paymentPlan: JSON.stringify([
                { milestone: 'Booking Amount', amount: 375000, dueDate: '2024-04-10', status: 'PAID' },
                { milestone: 'On Agreement', amount: 750000, dueDate: '2024-05-15', status: 'PAID' },
                { milestone: 'On Layout Approval', amount: 1125000, dueDate: '2024-08-31', status: 'PAID' },
                { milestone: 'On Road Completion', amount: 1500000, dueDate: '2024-12-31', status: 'PAID' },
                { milestone: 'On Underground Utilities', amount: 750000, dueDate: '2025-03-31', status: 'PAID' },
                { milestone: 'On Landscaping', amount: 1500000, dueDate: '2025-10-31', status: 'DUE' },
                { milestone: 'On Registration & Possession', amount: 1500000, dueDate: '2026-12-31', status: 'UPCOMING' },
            ]),
            payments: [
                { id: 'p1', amount: 375000, paidAt: new Date('2024-04-10'), mode: 'NEFT', referenceNo: 'NEFT240410001234', investmentId: 'inv1', receiptUrl: null, demandNoticeId: null, createdAt: new Date() },
                { id: 'p2', amount: 750000, paidAt: new Date('2024-05-15'), mode: 'RTGS', referenceNo: 'RTGS240515005678', investmentId: 'inv1', receiptUrl: null, demandNoticeId: null, createdAt: new Date() },
                { id: 'p3', amount: 1125000, paidAt: new Date('2024-08-30'), mode: 'NEFT', referenceNo: 'NEFT240830009012', investmentId: 'inv1', receiptUrl: null, demandNoticeId: null, createdAt: new Date() },
                { id: 'p4', amount: 1500000, paidAt: new Date('2024-12-28'), mode: 'UPI', referenceNo: 'UPI241228003456', investmentId: 'inv1', receiptUrl: null, demandNoticeId: null, createdAt: new Date() },
                { id: 'p5', amount: 750000, paidAt: new Date('2025-03-30'), mode: 'CHEQUE', referenceNo: 'CHQ025678', investmentId: 'inv1', receiptUrl: null, demandNoticeId: null, createdAt: new Date() },
            ],
            projectId: 'demo-sankhedi',
            unitId: 'u1',
            lastPredictionAt: new Date('2026-02-26'),
            marketAppreciation: 18,
            updatedAt: new Date(),
            createdAt: new Date(),
        }
    ],
    builderId: 'builder-1',
    constructionStart: new Date('2024-02-01'),
    actualCompletion: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    brochureUrl: null,
}

const DEMO_PROJECT_PINAKI = {
    ...DEMO_PROJECT,
    id: 'demo-pinaki',
    name: 'Pinaki Home',
    description: '72 Flats & Plots in the prime Banjari-Kolar locality of Bhopal by Shiva Estate. Near-completion project offering excellent appreciation potential in MP\'s fastest growing residential micro-market.',
    location: 'Area Banjari, Kolar',
    city: 'Bhopal',
    reraNumber: 'P4500067890',
    totalUnits: 72,
    totalProjectValue: 28,
    totalFundingTarget: 25,
    fundingRaised: 24,
    overallProgress: 92,
    status: 'NEAR_COMPLETION',
    projectType: 'RESIDENTIAL',
    expectedCompletion: new Date('2026-06-30'),
    milestones: [
        { id: '1', name: 'Foundation & Structure', targetDate: new Date('2024-06-30'), actualDate: new Date('2024-06-25'), progress: 100, status: 'COMPLETED', order: 1, description: null, createdAt: new Date() },
        { id: '2', name: 'Brick & Plaster Work', targetDate: new Date('2024-10-31'), actualDate: new Date('2024-10-28'), progress: 100, status: 'COMPLETED', order: 2, description: null, createdAt: new Date() },
        { id: '3', name: 'Flooring & Doors', targetDate: new Date('2025-02-28'), actualDate: new Date('2025-02-20'), progress: 100, status: 'COMPLETED', order: 3, description: null, createdAt: new Date() },
        { id: '4', name: 'Electrical & Plumbing Fitouts', targetDate: new Date('2025-08-31'), actualDate: new Date('2025-08-10'), progress: 100, status: 'COMPLETED', order: 4, description: null, createdAt: new Date() },
        { id: '5', name: 'Paint & External Finish', targetDate: new Date('2026-02-28'), actualDate: null, progress: 88, status: 'IN_PROGRESS', order: 5, description: 'External painting 90% done, common areas 85%.', createdAt: new Date() },
        { id: '6', name: 'OC & Possession', targetDate: new Date('2026-06-30'), actualDate: null, progress: 0, status: 'UPCOMING', order: 6, description: null, createdAt: new Date() },
    ],
}

