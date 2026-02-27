/**
 * Prisma Seed File — ShivaOS Investor Portal MVP
 * Run: pnpm db:seed
 *
 * Creates demo data for 3 scenarios:
 * A) Priya Nair (NRI investor) — 3BHK in Skyline
 * B) Builder posts construction update
 * C) Payment due alert for Rajesh Sharma
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

// Load env vars for seed script
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg({ pool })
const prisma = new PrismaClient({ adapter })


// INR helpers
const LAKH = 100_000
const CRORE = 10_000_000

async function main() {
    console.log('🌱 Starting seed...')

    // ── Clean existing data (FK-safe order) ────────────────────────────────────
    await prisma.notification.deleteMany()
    await prisma.document.deleteMany()
    await prisma.projectUpdate.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.investment.deleteMany()
    await prisma.unit.deleteMany()
    await prisma.floor.deleteMany()
    await prisma.milestone.deleteMany()
    await prisma.investor.deleteMany()
    await prisma.project.deleteMany()
    await prisma.builderUser.deleteMany()
    await prisma.builder.deleteMany()

    console.log('✅ Cleaned existing data')

    // ── 1. Builder: ShivaOS Realty ─────────────────────────────────────────────
    const builder = await prisma.builder.create({
        data: {
            name: 'Shiva Estate',
            logoUrl: null, // will upload via settings
            primaryColor: '#C9A84C',
            accentColor: '#1A1A2E',
            subdomain: 'shivaos',
            tagline: 'Shiva Buildcon · Shiva Investments',
            contactEmail: 'invest@shivaestate.com',
            contactPhone: '+91 755 4567 8900',
            reraId: 'A01600000001',
            tier: 'STARTER',
            showPoweredBy: true,
        },
    })
    console.log('✅ Builder created:', builder.name)

    // ── 2. Builder Admin Users (placeholder supabaseIds — update after Auth setup) ─
    await prisma.builderUser.createMany({
        data: [
            {
                builderId: builder.id,
                email: 'admin@shivaos.com',
                name: 'Arun Sharma',
                role: 'ADMIN',
                supabaseId: 'builder-admin-placeholder-001',
            },
            {
                builderId: builder.id,
                email: 'manager@shivaos.com',
                name: 'Deepa Reddy',
                role: 'MANAGER',
                supabaseId: 'builder-manager-placeholder-002',
            },
            {
                builderId: builder.id,
                email: 'viewer@shivaos.com',
                name: 'Kiran Babu',
                role: 'VIEWER',
                supabaseId: 'builder-viewer-placeholder-003',
            },
        ],
    })
    console.log('✅ Builder users created (3)')

    // ── 3. Projects ────────────────────────────────────────────────────────────

    // Project 1: ShivaOS Skyline — Under Construction (68%)
    const skyline = await prisma.project.create({
        data: {
            builderId: builder.id,
            name: 'ShivaOS Skyline',
            description:
                'A landmark 28-storey luxury residential tower offering 4BHK sky homes with panoramic views of the Kokapet Financial Corridor. ShivaOS Skyline redefines urban living with world-class amenities, smart home features, and IGBC Green certification.',
            location: 'Kokapet, Outer Ring Road',
            city: 'Hyderabad',
            state: 'Telangana',
            reraNumber: 'P02400001234',
            reraState: 'TS',
            totalUnits: 280,
            totalProjectValue: 480, // crores
            totalFundingTarget: 420, // crores
            fundingRaised: 340,
            constructionStart: new Date('2023-06-01'),
            expectedCompletion: new Date('2026-03-31'),
            overallProgress: 68,
            status: 'UNDER_CONSTRUCTION',
            projectType: 'RESIDENTIAL',
            thumbnailUrl: null,
            latitude: 17.4099,
            longitude: 78.3567,
        },
    })

    // Project 2: ShivaOS Gardens — Near Completion (92%)
    const gardens = await prisma.project.create({
        data: {
            builderId: builder.id,
            name: 'ShivaOS Gardens',
            description:
                'An exclusive gated villa community spread across 48 acres in the serene Shamshabad corridor. Each villa features private gardens, 3-car garages, and resort-style clubhouse access.',
            location: 'Shamshabad, Rajiv Gandhi International Airport Road',
            city: 'Hyderabad',
            state: 'Telangana',
            reraNumber: 'P02400005678',
            reraState: 'TS',
            totalUnits: 160,
            totalProjectValue: 220, // crores
            totalFundingTarget: 200,
            fundingRaised: 198,
            constructionStart: new Date('2022-09-01'),
            expectedCompletion: new Date('2025-06-30'),
            overallProgress: 92,
            status: 'NEAR_COMPLETION',
            projectType: 'VILLA',
            thumbnailUrl: null,
            latitude: 17.2403,
            longitude: 78.4294,
        },
    })

    // Project 3: ShivaOS Horizon — Upcoming / Pre-Launch
    const horizon = await prisma.project.create({
        data: {
            builderId: builder.id,
            name: 'ShivaOS Horizon',
            description:
                'The most anticipated launch in Hyderabad\'s Financial District — 400 premium 2, 3 & 4BHK residences at the heart of the HITEC City growth corridor. Register your interest for early pre-launch pricing.',
            location: 'Financial District, Nanakramguda',
            city: 'Hyderabad',
            state: 'Telangana',
            reraNumber: 'P02400009999',
            reraState: 'TS',
            totalUnits: 400,
            totalProjectValue: 620, // crores
            totalFundingTarget: 550,
            fundingRaised: 0,
            overallProgress: 0,
            status: 'UPCOMING',
            projectType: 'RESIDENTIAL',
            thumbnailUrl: null,
            latitude: 17.4448,
            longitude: 78.3772,
        },
    })

    console.log('✅ Projects created (3): Skyline, Gardens, Horizon')

    // ── 4. Floors & Units (Skyline) ────────────────────────────────────────────

    const skylineFloor12 = await prisma.floor.create({
        data: {
            projectId: skyline.id,
            name: 'Tower A — Floor 12',
            totalUnits: 4,
            progress: 85,
        },
    })

    const skylineFloor8 = await prisma.floor.create({
        data: {
            projectId: skyline.id,
            name: 'Tower A — Floor 8',
            totalUnits: 4,
            progress: 90,
        },
    })

    const skylineFloor20 = await prisma.floor.create({
        data: {
            projectId: skyline.id,
            name: 'Tower B — Floor 20',
            totalUnits: 4,
            progress: 55,
        },
    })

    // Units in Skyline
    const unitA1201 = await prisma.unit.create({
        data: {
            floorId: skylineFloor12.id,
            unitNumber: 'A-1201',
            type: '3BHK',
            carpetArea: 1650,
            price: 1.85 * CRORE,
            status: 'BOOKED',
        },
    })

    const unitA1204 = await prisma.unit.create({
        data: {
            floorId: skylineFloor12.id,
            unitNumber: 'A-1204',
            type: '2BHK',
            carpetArea: 1200,
            price: 1.2 * CRORE,
            status: 'BOOKED',
        },
    })

    const unitA0803 = await prisma.unit.create({
        data: {
            floorId: skylineFloor8.id,
            unitNumber: 'A-0803',
            type: '2BHK',
            carpetArea: 1100,
            price: 95 * LAKH,
            status: 'BOOKED',
        },
    })

    const unitB2001 = await prisma.unit.create({
        data: {
            floorId: skylineFloor20.id,
            unitNumber: 'B-2001',
            type: '4BHK',
            carpetArea: 2400,
            price: 3.2 * CRORE,
            status: 'AVAILABLE',
        },
    })

    // Gardens Villa Unit
    const gardensFloor = await prisma.floor.create({
        data: {
            projectId: gardens.id,
            name: 'Phase 1 — Sector A',
            totalUnits: 20,
            progress: 95,
        },
    })

    const villaUnit = await prisma.unit.create({
        data: {
            floorId: gardensFloor.id,
            unitNumber: 'VILLA-A-12',
            type: 'Villa (4BHK)',
            carpetArea: 3200,
            price: 2.4 * CRORE,
            status: 'REGISTERED',
        },
    })

    // Horizon pre-launch floor
    const horizonFloor = await prisma.floor.create({
        data: {
            projectId: horizon.id,
            name: 'Tower 1 — Sample Floor',
            totalUnits: 8,
            progress: 0,
        },
    })

    const horizonUnit = await prisma.unit.create({
        data: {
            floorId: horizonFloor.id,
            unitNumber: 'T1-1502',
            type: '3BHK',
            carpetArea: 1580,
            price: 1.6 * CRORE,
            status: 'AVAILABLE',
        },
    })

    console.log('✅ Floors and Units created')

    // ── 5. Investors (5 demo investors) ──────────────────────────────────────────

    const rajesh = await prisma.investor.create({
        data: {
            builderId: builder.id,
            supabaseId: 'investor-rajesh-placeholder-001',
            name: 'Rajesh Sharma',
            email: 'rajesh.sharma@gmail.com',
            phone: '+91 98765 43210',
            panNumber: 'ABCPS1234R',
            aadhaarLast4: '7821',
            isNRI: false,
            preferredLanguage: 'en',
            onboardedAt: new Date('2024-01-10'),
        },
    })

    const priya = await prisma.investor.create({
        data: {
            builderId: builder.id,
            supabaseId: 'investor-priya-placeholder-002',
            name: 'Priya Nair',
            email: 'priya.nair@gmail.com',
            phone: '+971 50 123 4567',
            panNumber: 'DFGPN5678K',
            isNRI: true,
            country: 'UAE',
            preferredLanguage: 'en',
            onboardedAt: new Date('2024-01-15'),
        },
    })

    const vikram = await prisma.investor.create({
        data: {
            builderId: builder.id,
            supabaseId: 'investor-vikram-placeholder-003',
            name: 'Vikram Mehta',
            email: 'vikram.mehta@outlook.com',
            phone: '+91 99887 76655',
            panNumber: 'HIJVM9012L',
            aadhaarLast4: '4532',
            isNRI: false,
            preferredLanguage: 'en',
            onboardedAt: new Date('2023-11-20'),
        },
    })

    const sunita = await prisma.investor.create({
        data: {
            builderId: builder.id,
            supabaseId: 'investor-sunita-placeholder-004',
            name: 'Sunita Reddy',
            email: 'sunita.reddy@yahoo.com',
            phone: '+91 94456 78901',
            panNumber: 'KLMSR3456N',
            aadhaarLast4: '9104',
            isNRI: false,
            preferredLanguage: 'en',
            onboardedAt: new Date('2024-02-01'),
        },
    })

    const arjun = await prisma.investor.create({
        data: {
            builderId: builder.id,
            supabaseId: 'investor-arjun-placeholder-005',
            name: 'Arjun Kapoor',
            email: 'arjun.kapoor@gmail.com',
            phone: '+91 80011 22334',
            panNumber: 'NOPAK7890P',
            aadhaarLast4: '2267',
            isNRI: false,
            preferredLanguage: 'en',
            onboardedAt: new Date('2026-01-05'),
        },
    })

    console.log('✅ Investors created (5)')

    // ── 6. Investments ────────────────────────────────────────────────────────

    // Rajesh → Unit A-1204 in Skyline (₹1.2 Cr)
    const investmentRajesh = await prisma.investment.create({
        data: {
            investorId: rajesh.id,
            projectId: skyline.id,
            unitId: unitA1204.id,
            bookingAmount: 5 * LAKH,
            totalAgreedAmount: 1.2 * CRORE,
            totalPaid: 85 * LAKH,
            pendingAmount: 35 * LAKH,
            agreementDate: new Date('2024-02-15'),
            agreementNumber: 'SSK/AGR/2024/0847',
            possessionDate: new Date('2026-03-31'),
            predictedReturnPct: 18.5,
            predictedReturnRange: '15-22%',
            marketAppreciation: 22,
            confidenceScore: 0.82,
            lastPredictionAt: new Date('2026-02-14'),
            status: 'UNDER_CONSTRUCTION',
            paymentPlan: JSON.stringify([
                { milestone: 'Booking', amount: 500000, dueDate: '2024-01-12', status: 'PAID' },
                { milestone: 'On Agreement', amount: 1000000, dueDate: '2024-02-15', status: 'PAID' },
                { milestone: 'On Foundation', amount: 1500000, dueDate: '2024-06-30', status: 'PAID' },
                { milestone: 'On 5th Floor Slab', amount: 2000000, dueDate: '2024-12-31', status: 'PAID' },
                { milestone: 'On 10th Floor Slab', amount: 2000000, dueDate: '2025-02-28', status: 'DUE' },
                { milestone: 'On 15th Floor Slab', amount: 2000000, dueDate: '2025-08-31', status: 'UPCOMING' },
                { milestone: 'On Possession', amount: 3000000, dueDate: '2026-03-31', status: 'UPCOMING' },
            ]),
        },
    })

    // Priya → Unit A-1201 in Skyline (₹1.85 Cr, NRI)
    const investmentPriya = await prisma.investment.create({
        data: {
            investorId: priya.id,
            projectId: skyline.id,
            unitId: unitA1201.id,
            bookingAmount: 10 * LAKH,
            totalAgreedAmount: 1.85 * CRORE,
            totalPaid: 1.3 * CRORE,
            pendingAmount: 55 * LAKH,
            agreementDate: new Date('2024-01-20'),
            agreementNumber: 'SSK/AGR/2024/0312',
            possessionDate: new Date('2026-03-31'),
            predictedReturnPct: 21.3,
            predictedReturnRange: '18-26%',
            marketAppreciation: 25,
            confidenceScore: 0.85,
            lastPredictionAt: new Date('2026-02-14'),
            status: 'UNDER_CONSTRUCTION',
            paymentPlan: JSON.stringify([
                { milestone: 'Booking', amount: 1000000, dueDate: '2024-01-15', status: 'PAID' },
                { milestone: 'On Agreement', amount: 2000000, dueDate: '2024-01-20', status: 'PAID' },
                { milestone: 'On Foundation', amount: 3000000, dueDate: '2024-07-15', status: 'PAID' },
                { milestone: 'On 5th Floor Slab', amount: 3500000, dueDate: '2024-12-31', status: 'PAID' },
                { milestone: 'On 10th Floor Slab', amount: 4000000, dueDate: '2025-03-31', status: 'DUE' },
                { milestone: 'On Possession', amount: 5000000, dueDate: '2026-03-31', status: 'UPCOMING' },
            ]),
        },
    })

    // Vikram → Villa A-12 in Gardens (₹2.4 Cr)
    const investmentVikram = await prisma.investment.create({
        data: {
            investorId: vikram.id,
            projectId: gardens.id,
            unitId: villaUnit.id,
            bookingAmount: 20 * LAKH,
            totalAgreedAmount: 2.4 * CRORE,
            totalPaid: 2.4 * CRORE,
            pendingAmount: 0,
            agreementDate: new Date('2023-12-01'),
            agreementNumber: 'SGD/AGR/2023/0054',
            possessionDate: new Date('2025-06-30'),
            predictedReturnPct: 28.4,
            predictedReturnRange: '24-32%',
            marketAppreciation: 32,
            confidenceScore: 0.91,
            lastPredictionAt: new Date('2026-02-14'),
            status: 'READY_FOR_POSSESSION',
        },
    })

    // Sunita → Unit A-0803 in Skyline (₹95 L)
    const investmentSunita = await prisma.investment.create({
        data: {
            investorId: sunita.id,
            projectId: skyline.id,
            unitId: unitA0803.id,
            bookingAmount: 3 * LAKH,
            totalAgreedAmount: 95 * LAKH,
            totalPaid: 60 * LAKH,
            pendingAmount: 35 * LAKH,
            agreementDate: new Date('2024-03-01'),
            agreementNumber: 'SSK/AGR/2024/1124',
            possessionDate: new Date('2026-03-31'),
            predictedReturnPct: 17.2,
            predictedReturnRange: '14-20%',
            marketAppreciation: 20,
            confidenceScore: 0.79,
            lastPredictionAt: new Date('2026-02-14'),
            status: 'UNDER_CONSTRUCTION',
        },
    })

    // Arjun → Pre-registered for Horizon (no unit yet)
    const investmentArjun = await prisma.investment.create({
        data: {
            investorId: arjun.id,
            projectId: horizon.id,
            unitId: null,
            bookingAmount: 2 * LAKH, // expression of interest
            totalAgreedAmount: 1.6 * CRORE,
            totalPaid: 2 * LAKH,
            pendingAmount: 1.58 * CRORE,
            possessionDate: new Date('2028-12-31'),
            predictedReturnPct: 32.0,
            predictedReturnRange: '28-38%',
            marketAppreciation: 40,
            confidenceScore: 0.68,
            lastPredictionAt: new Date('2026-02-14'),
            status: 'BOOKED',
        },
    })

    console.log('✅ Investments created (5)')

    // ── 7. Payments ────────────────────────────────────────────────────────────

    // Rajesh's payments
    await prisma.payment.createMany({
        data: [
            {
                investmentId: investmentRajesh.id,
                amount: 5 * LAKH,
                paidAt: new Date('2024-01-12'),
                mode: 'NEFT',
                referenceNo: 'NEFT240112001234',
            },
            {
                investmentId: investmentRajesh.id,
                amount: 10 * LAKH,
                paidAt: new Date('2024-02-15'),
                mode: 'RTGS',
                referenceNo: 'RTGS240215005678',
            },
            {
                investmentId: investmentRajesh.id,
                amount: 15 * LAKH,
                paidAt: new Date('2024-06-30'),
                mode: 'NEFT',
                referenceNo: 'NEFT240630009012',
            },
            {
                investmentId: investmentRajesh.id,
                amount: 20 * LAKH,
                paidAt: new Date('2024-12-28'),
                mode: 'UPI',
                referenceNo: 'UPI241228003456',
            },
        ],
    })

    // Priya's payments (NRI — via SWIFT/RTGS)
    await prisma.payment.createMany({
        data: [
            {
                investmentId: investmentPriya.id,
                amount: 10 * LAKH,
                paidAt: new Date('2024-01-15'),
                mode: 'NEFT',
                referenceNo: 'SWIFT2401150087',
            },
            {
                investmentId: investmentPriya.id,
                amount: 20 * LAKH,
                paidAt: new Date('2024-01-20'),
                mode: 'RTGS',
                referenceNo: 'RTGS240120007654',
            },
            {
                investmentId: investmentPriya.id,
                amount: 30 * LAKH,
                paidAt: new Date('2024-07-15'),
                mode: 'RTGS',
                referenceNo: 'RTGS240715002341',
            },
            {
                investmentId: investmentPriya.id,
                amount: 35 * LAKH,
                paidAt: new Date('2024-12-31'),
                mode: 'RTGS',
                referenceNo: 'RTGS241231008765',
            },
        ],
    })

    // Vikram (fully paid)
    await prisma.payment.createMany({
        data: [
            {
                investmentId: investmentVikram.id,
                amount: 20 * LAKH,
                paidAt: new Date('2023-12-01'),
                mode: 'Cheque',
                referenceNo: 'CHQ/HDFC/20231201',
            },
            {
                investmentId: investmentVikram.id,
                amount: 80 * LAKH,
                paidAt: new Date('2024-02-15'),
                mode: 'RTGS',
                referenceNo: 'RTGS240215009900',
            },
            {
                investmentId: investmentVikram.id,
                amount: 1.4 * CRORE,
                paidAt: new Date('2024-08-01'),
                mode: 'RTGS',
                referenceNo: 'RTGS240801001122',
            },
        ],
    })

    // Sunita
    await prisma.payment.createMany({
        data: [
            {
                investmentId: investmentSunita.id,
                amount: 3 * LAKH,
                paidAt: new Date('2024-02-28'),
                mode: 'UPI',
                referenceNo: 'UPI240228004455',
            },
            {
                investmentId: investmentSunita.id,
                amount: 12 * LAKH,
                paidAt: new Date('2024-04-15'),
                mode: 'NEFT',
                referenceNo: 'NEFT240415006677',
            },
            {
                investmentId: investmentSunita.id,
                amount: 25 * LAKH,
                paidAt: new Date('2024-10-20'),
                mode: 'RTGS',
                referenceNo: 'RTGS241020007788',
            },
            {
                investmentId: investmentSunita.id,
                amount: 20 * LAKH,
                paidAt: new Date('2025-01-10'),
                mode: 'NEFT',
                referenceNo: 'NEFT250110008899',
            },
        ],
    })

    // Arjun (expression of interest)
    await prisma.payment.create({
        data: {
            investmentId: investmentArjun.id,
            amount: 2 * LAKH,
            paidAt: new Date('2026-01-05'),
            mode: 'UPI',
            referenceNo: 'UPI260105011223',
        },
    })

    console.log('✅ Payments created (14)')

    // ── 8. Milestones (Skyline — 8 milestones) ──────────────────────────────────

    await prisma.milestone.createMany({
        data: [
            {
                projectId: skyline.id,
                name: 'Foundation Complete',
                description: 'Deep piling and foundation work across both towers A & B completed.',
                targetDate: new Date('2023-10-31'),
                actualDate: new Date('2023-10-28'),
                progress: 100,
                status: 'COMPLETED',
                order: 1,
            },
            {
                projectId: skyline.id,
                name: 'Plinth Beam & Ground Floor',
                description: 'Plinth beam casting and ground floor slab completed for both towers.',
                targetDate: new Date('2023-12-31'),
                actualDate: new Date('2023-12-22'),
                progress: 100,
                status: 'COMPLETED',
                order: 2,
            },
            {
                projectId: skyline.id,
                name: '1st–5th Floor Slabs',
                description: 'Structural slabs for floors 1 through 5 poured and cured.',
                targetDate: new Date('2024-02-28'),
                actualDate: new Date('2024-02-20'),
                progress: 100,
                status: 'COMPLETED',
                order: 3,
            },
            {
                projectId: skyline.id,
                name: '6th–10th Floor Slabs',
                description: 'Mid-rise structural work including MEP rough-ins completed.',
                targetDate: new Date('2024-06-30'),
                actualDate: new Date('2024-06-25'),
                progress: 100,
                status: 'COMPLETED',
                order: 4,
            },
            {
                projectId: skyline.id,
                name: '11th–15th Floor Slabs',
                description: 'Upper-mid structure — Tower A ahead of schedule, Tower B on track.',
                targetDate: new Date('2024-10-31'),
                actualDate: new Date('2024-10-29'),
                progress: 100,
                status: 'COMPLETED',
                order: 5,
            },
            {
                projectId: skyline.id,
                name: '16th–20th Floor Slabs',
                description: 'High-rise slab casting currently in progress. Tower A at 75%, Tower B at 40%.',
                targetDate: new Date('2025-04-30'),
                actualDate: null,
                progress: 72,
                status: 'IN_PROGRESS',
                order: 6,
            },
            {
                projectId: skyline.id,
                name: '21st–28th Floor & Terrace Slab',
                description: 'Top floors and terrace slab — structural completion milestone.',
                targetDate: new Date('2025-09-30'),
                actualDate: null,
                progress: 0,
                status: 'UPCOMING',
                order: 7,
            },
            {
                projectId: skyline.id,
                name: 'Finishing, Fitouts & Possession',
                description: 'Internal finishing, MEP, flooring, kitchen fittings, and possession handovers.',
                targetDate: new Date('2026-03-31'),
                actualDate: null,
                progress: 0,
                status: 'UPCOMING',
                order: 8,
            },
        ],
    })

    // Gardens milestones (near completion)
    await prisma.milestone.createMany({
        data: [
            {
                projectId: gardens.id,
                name: 'Site Development & Roads',
                targetDate: new Date('2023-03-31'),
                actualDate: new Date('2023-03-20'),
                progress: 100,
                status: 'COMPLETED',
                order: 1,
            },
            {
                projectId: gardens.id,
                name: 'Villa Structures Complete',
                targetDate: new Date('2024-06-30'),
                actualDate: new Date('2024-06-15'),
                progress: 100,
                status: 'COMPLETED',
                order: 2,
            },
            {
                projectId: gardens.id,
                name: 'Landscaping & Clubhouse',
                description: 'Landscaping, pool, clubhouse, and external amenities. 95% complete.',
                targetDate: new Date('2025-03-31'),
                actualDate: null,
                progress: 95,
                status: 'IN_PROGRESS',
                order: 3,
            },
            {
                projectId: gardens.id,
                name: 'OC & Possession',
                description: 'Occupancy Certificate filing and possession handovers.',
                targetDate: new Date('2025-06-30'),
                actualDate: null,
                progress: 0,
                status: 'UPCOMING',
                order: 4,
            },
        ],
    })

    console.log('✅ Milestones created (12)')

    // ── 9. Project Updates ────────────────────────────────────────────────────

    const update1 = await prisma.projectUpdate.create({
        data: {
            projectId: skyline.id,
            title: 'Progress Update — February 2026',
            body: `We are pleased to share that **ShivaOS Skyline** is progressing on schedule at **68% overall completion**.

**Tower A** has reached the 19th floor slab with excellent structural quality. Our on-site quality team has cleared all 18 completed floors with zero NCRs (Non-Conformance Reports).

**Tower B** is currently at the 16th floor slab, progressing at a pace of approximately 1.2 floors per week.

**Next milestone**: Completion of all slabs up to the 20th floor (Tower A) by **15 March 2026**.

MEP rough-in work (electrical, plumbing, HVAC) is running parallel on floors 1–12 of Tower A, keeping us ahead of the fitout schedule.

Your possession remains on track for **March 2026**. We appreciate your trust in ShivaOS.`,
            photoUrls: [],
            updateType: 'CONSTRUCTION',
            isPublished: true,
            publishedAt: new Date('2026-02-14'),
            aiGenerated: false,
        },
    })

    const update2 = await prisma.projectUpdate.create({
        data: {
            projectId: skyline.id,
            title: 'RERA Quarterly Compliance Filing — Q3 FY26',
            body: `ShivaOS Realty has successfully filed the **Q3 FY2025-26 RERA compliance report** for ShivaOS Skyline (RERA No: P02400001234) with the Telangana Real Estate Regulatory Authority.

**Compliance Score**: 94/100 ✅

All mandatory quarterly disclosures — including unit bookings, construction progress, and fund utilisation — have been filed within the stipulated deadline.

The project remains **fully RERA compliant** with no pending notices or show-cause orders.

You can view the latest filing on [TSRERA Portal](https://rera.telangana.gov.in) using RERA No. **P02400001234**.`,
            photoUrls: [],
            updateType: 'RERA_COMPLIANCE',
            isPublished: true,
            publishedAt: new Date('2026-01-15'),
            aiGenerated: true,
        },
    })

    const update3 = await prisma.projectUpdate.create({
        data: {
            projectId: gardens.id,
            title: 'ShivaOS Gardens — Approaching Possession',
            body: `**ShivaOS Gardens** is at **92% completion** and we are on track for possession handovers beginning **April 2026**.

Landscape work across all 48 acres is 95% complete. The Clubhouse pool has been commissioned and is fully operational. Road surfacing, exterior lighting, and gate infrastructure are in final stages.

**OC (Occupancy Certificate)** application has been filed with GHMC on 28 January 2026. We expect approval by **15 March 2026**.

Villa owners: Possession intimation letters will be dispatched **30 days prior** to your scheduled handover date. Please ensure your final payment demand is cleared to avoid delays.`,
            photoUrls: [],
            updateType: 'POSSESSION',
            isPublished: true,
            publishedAt: new Date('2026-02-10'),
            aiGenerated: false,
        },
    })

    const update4 = await prisma.projectUpdate.create({
        data: {
            projectId: horizon.id,
            title: 'ShivaOS Horizon — Pre-Launch Interest Registration Open',
            body: `We are thrilled to announce that **ShivaOS Horizon**, our most ambitious project in the heart of Hyderabad's Financial District, is now accepting pre-launch interest registrations.

**Project Highlights**:
- 400 premium 2, 3 & 4BHK residences
- Located in Nanakramguda — walking distance from major IT parks
- G+40 tower with panoramic city views
- RERA filed: P02400009999

**Early registrants** will receive priority unit allocation and pre-launch pricing (estimated 12-15% below launch price).

Expected launch: **Q2 2026**. Construction commencement: **Q3 2026**.`,
            photoUrls: [],
            updateType: 'GENERAL',
            isPublished: true,
            publishedAt: new Date('2026-02-01'),
            aiGenerated: false,
        },
    })

    const update5 = await prisma.projectUpdate.create({
        data: {
            projectId: skyline.id,
            title: 'Payment Demand — 10th Floor Slab Milestone',
            body: `Dear Investor,

As per your payment schedule, a **demand notice** has been raised for the **10th Floor Slab milestone** of ShivaOS Skyline.

**Demand Details**:
- Milestone: On 10th Floor Slab Completion
- Amount Due: As per your individual payment schedule
- Due Date: **28 February 2026**

Payment can be made via NEFT/RTGS to our project escrow account. UPI payments accepted for amounts up to ₹2 Lakhs.

Please contact your relationship manager for any payment-related queries.`,
            photoUrls: [],
            updateType: 'FINANCIAL',
            isPublished: true,
            publishedAt: new Date('2026-02-01'),
            aiGenerated: false,
        },
    })

    console.log('✅ Project updates created (5)')

    // ── 10. Documents ─────────────────────────────────────────────────────────

    await prisma.document.createMany({
        data: [
            // Rajesh's documents
            {
                investorId: rajesh.id,
                projectId: skyline.id,
                name: 'Allotment Letter — Unit A-1204',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/allotment_rajesh.pdf',
                fileSize: 245000,
                mimeType: 'application/pdf',
                documentType: 'ALLOTMENT_LETTER',
                aiCategory: 'Allotment Letter',
                aiExtractedData: {
                    unitNumber: 'A-1204',
                    projectName: 'ShivaOS Skyline',
                    investorName: 'Rajesh Sharma',
                    allotmentDate: '2024-01-12',
                    totalAmount: 12000000,
                },
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            {
                investorId: rajesh.id,
                projectId: skyline.id,
                name: 'Sale Agreement — SSK/AGR/2024/0847',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/agreement_rajesh.pdf',
                fileSize: 890000,
                mimeType: 'application/pdf',
                documentType: 'SALE_AGREEMENT',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            // Priya's documents
            {
                investorId: priya.id,
                projectId: skyline.id,
                name: 'Allotment Letter — Unit A-1201',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/allotment_priya.pdf',
                fileSize: 248000,
                mimeType: 'application/pdf',
                documentType: 'ALLOTMENT_LETTER',
                aiCategory: 'Allotment Letter',
                aiExtractedData: {
                    unitNumber: 'A-1201',
                    projectName: 'ShivaOS Skyline',
                    investorName: 'Priya Nair',
                    allotmentDate: '2024-01-15',
                    totalAmount: 18500000,
                },
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            {
                investorId: priya.id,
                projectId: skyline.id,
                name: 'Sale Agreement — SSK/AGR/2024/0312',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/agreement_priya.pdf',
                fileSize: 892000,
                mimeType: 'application/pdf',
                documentType: 'SALE_AGREEMENT',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            // Vikram — Gardens
            {
                investorId: vikram.id,
                projectId: gardens.id,
                name: 'Villa Allotment — VILLA-A-12',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/allotment_vikram.pdf',
                fileSize: 260000,
                mimeType: 'application/pdf',
                documentType: 'ALLOTMENT_LETTER',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            {
                investorId: vikram.id,
                projectId: gardens.id,
                name: 'Sale Agreement — SGD/AGR/2023/0054',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/agreement_vikram.pdf',
                fileSize: 940000,
                mimeType: 'application/pdf',
                documentType: 'SALE_AGREEMENT',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            // Project-level documents
            {
                projectId: skyline.id,
                name: 'ShivaOS Skyline — RERA Certificate',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/rera_skyline.pdf',
                fileSize: 180000,
                mimeType: 'application/pdf',
                documentType: 'RERA_REGISTRATION',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            {
                projectId: skyline.id,
                name: 'ShivaOS Skyline — Floor Plan (Tower A)',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/floorplan_skyline_a.pdf',
                fileSize: 4200000,
                mimeType: 'application/pdf',
                documentType: 'FLOOR_PLAN',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
            {
                projectId: skyline.id,
                name: 'ShivaOS Skyline — Project Brochure',
                fileUrl: 'https://placeholder.supabase.co/storage/v1/object/public/docs/brochure_skyline.pdf',
                fileSize: 12500000,
                mimeType: 'application/pdf',
                documentType: 'BROCHURE',
                uploadedBy: 'builder',
                isVisibleToInvestor: true,
            },
        ],
    })

    console.log('✅ Documents created (9)')

    // ── 11. Notifications ────────────────────────────────────────────────────

    await prisma.notification.createMany({
        data: [
            // Rajesh notifications
            {
                investorId: rajesh.id,
                projectUpdateId: update5.id,
                title: '💰 Payment Due: ₹20L by 28 Feb 2026',
                body: 'Your 10th Floor Slab milestone payment of ₹20,00,000 is due on 28 February 2026 for Unit A-1204, ShivaOS Skyline.',
                type: 'PAYMENT_DUE',
                isRead: false,
                createdAt: new Date('2026-02-01'),
            },
            {
                investorId: rajesh.id,
                projectUpdateId: update1.id,
                title: '🏗️ Construction Update — February 2026',
                body: 'ShivaOS Skyline is at 68% completion. Tower A has reached the 19th floor.',
                type: 'UPDATE',
                isRead: true,
                createdAt: new Date('2026-02-14'),
            },
            {
                investorId: rajesh.id,
                title: '🤖 AI Insight: Strong appreciation expected in Kokapet',
                body: 'Your unit A-1204 is projected to appreciate 18-22% by possession. Confidence: High (82%).',
                type: 'AI_INSIGHT',
                isRead: false,
                createdAt: new Date('2026-02-14'),
            },
            // Priya notifications
            {
                investorId: priya.id,
                projectUpdateId: update5.id,
                title: '💰 Payment Due: ₹40L by 31 Mar 2026',
                body: 'Your 10th Floor Slab milestone payment of ₹40,00,000 is due on 31 March 2026 for Unit A-1201, ShivaOS Skyline.',
                type: 'PAYMENT_DUE',
                isRead: false,
                createdAt: new Date('2026-02-01'),
            },
            {
                investorId: priya.id,
                projectUpdateId: update1.id,
                title: '🏗️ Construction Update — February 2026',
                body: 'ShivaOS Skyline is at 68% completion. Tower A has reached the 19th floor.',
                type: 'UPDATE',
                isRead: false,
                createdAt: new Date('2026-02-14'),
            },
            {
                investorId: priya.id,
                title: '🤖 AI Insight: Kokapet 19% appreciation trend continues',
                body: 'Your unit A-1201 (3BHK) is projected to appreciate 21-26% by possession. Analysis updated.',
                type: 'AI_INSIGHT',
                isRead: false,
                createdAt: new Date('2026-02-14'),
            },
            {
                investorId: priya.id,
                projectUpdateId: update2.id,
                title: '✅ RERA Q3 Compliance Filed — 94/100 Score',
                body: 'ShivaOS Skyline\'s Q3 RERA compliance has been filed successfully with a score of 94/100.',
                type: 'RERA_ALERT',
                isRead: true,
                createdAt: new Date('2026-01-15'),
            },
            // Vikram notifications
            {
                investorId: vikram.id,
                projectUpdateId: update3.id,
                title: '🏠 Possession Update — ShivaOS Gardens',
                body: 'ShivaOS Gardens is at 92% completion. OC application filed. Possession expected April 2026.',
                type: 'UPDATE',
                isRead: false,
                createdAt: new Date('2026-02-10'),
            },
            {
                investorId: vikram.id,
                title: '🏆 Milestone: OC Application Filed!',
                body: 'Occupancy Certificate application for ShivaOS Gardens has been filed with GHMC on 28 Jan 2026.',
                type: 'MILESTONE_REACHED',
                isRead: false,
                createdAt: new Date('2026-01-28'),
            },
            // Sunita
            {
                investorId: sunita.id,
                projectUpdateId: update5.id,
                title: '💰 Payment Due: ₹20L by 28 Feb 2026',
                body: 'Your milestone payment for Unit A-0803, ShivaOS Skyline is due on 28 February 2026.',
                type: 'PAYMENT_DUE',
                isRead: false,
                createdAt: new Date('2026-02-01'),
            },
            // Arjun
            {
                investorId: arjun.id,
                projectUpdateId: update4.id,
                title: '🚀 ShivaOS Horizon — Pre-Launch Registration Confirmed',
                body: 'Your interest registration for ShivaOS Horizon has been received. Launch expected Q2 2026.',
                type: 'UPDATE',
                isRead: false,
                createdAt: new Date('2026-02-01'),
            },
        ],
    })

    console.log('✅ Notifications created (11)')

    console.log('\n🎉 Seed complete! Summary:')
    console.log('   • 1 Builder: ShivaOS Realty')
    console.log('   • 3 Builder Users (Admin/Manager/Viewer)')
    console.log('   • 3 Projects (Skyline 68%, Gardens 92%, Horizon 0%)')
    console.log('   • 5 Investors (Rajesh, Priya-NRI, Vikram, Sunita, Arjun)')
    console.log('   • 5 Investments')
    console.log('   • 14 Payments')
    console.log('   • 12 Milestones')
    console.log('   • 5 Project Updates')
    console.log('   • 9 Documents')
    console.log('   • 11 Notifications')
    console.log('\n💡 Next: Fill in .env.local with Supabase credentials, then run:')
    console.log('   pnpm prisma migrate dev --name init')
    console.log('   pnpm db:seed')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
