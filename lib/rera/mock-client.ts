/**
 * Mock RERA API client
 * In production: replace with Surepass RERA API calls
 */

export interface RERAStatus {
    isRegistered: boolean
    lastUpdated: string
    complianceScore: number
    pendingFilings: string[]
    projectStatus: string
    reraProjectName: string
    promoterName: string
    expectedCompletion: string
}

const MOCK_RERA_DATA: Record<string, RERAStatus> = {
    'P02400001234': {
        isRegistered: true,
        lastUpdated: '2026-01-15',
        complianceScore: 94,
        pendingFilings: [],
        projectStatus: 'Under Construction',
        reraProjectName: 'ShivaOS Skyline',
        promoterName: 'ShivaOS Realty Pvt Ltd',
        expectedCompletion: '2026-03-31',
    },
    'P02400005678': {
        isRegistered: true,
        lastUpdated: '2026-01-20',
        complianceScore: 97,
        pendingFilings: ['Q4 2025 progress report (due 15 Jan 2026)'],
        projectStatus: 'Near Completion',
        reraProjectName: 'ShivaOS Gardens',
        promoterName: 'ShivaOS Realty Pvt Ltd',
        expectedCompletion: '2025-06-30',
    },
    'P02400009999': {
        isRegistered: true,
        lastUpdated: '2026-02-01',
        complianceScore: 100,
        pendingFilings: [],
        projectStatus: 'Registered',
        reraProjectName: 'ShivaOS Horizon',
        promoterName: 'ShivaOS Realty Pvt Ltd',
        expectedCompletion: '2028-12-31',
    },
}

export async function checkRERACompliance(
    reraNumber: string,
    _state: string
): Promise<RERAStatus> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500))

    const data = MOCK_RERA_DATA[reraNumber]
    if (!data) {
        return {
            isRegistered: false,
            lastUpdated: new Date().toISOString().split('T')[0],
            complianceScore: 0,
            pendingFilings: ['Registration not found'],
            projectStatus: 'Unknown',
            reraProjectName: 'Unknown',
            promoterName: 'Unknown',
            expectedCompletion: 'Unknown',
        }
    }

    return data
}
