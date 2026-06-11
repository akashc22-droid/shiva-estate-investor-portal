import { NextRequest, NextResponse } from 'next/server'
import { gemini, GEMINI_MODEL, isGeminiConfigured } from '@/lib/ai/gemini'

export async function POST(request: NextRequest) {
    try {
        if (!isGeminiConfigured) {
            return NextResponse.json(
                { error: 'AI is not configured. Set GEMINI_API_KEY in the environment.' },
                { status: 503 },
            )
        }

        const body = await request.json()
        const { fileName, mimeType } = body

        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: `Classify this real estate document and extract key information.

File name: ${fileName}
MIME type: ${mimeType}

Based on the file name and type, classify into one of these categories:
ALLOTMENT_LETTER, SALE_AGREEMENT, PAYMENT_RECEIPT, DEMAND_NOTICE, OC_CERTIFICATE, CC_CERTIFICATE,
RERA_REGISTRATION, FLOOR_PLAN, BROCHURE, NOC, POSSESSION_LETTER, OTHER

Respond in JSON format:
{
  "category": "CATEGORY_NAME",
  "confidence": 0.95,
  "extractedInfo": {
    "documentDate": "if identifiable",
    "parties": ["names if identifiable"],
    "amounts": ["amounts if identifiable"],
    "keyDates": ["dates if identifiable"]
  },
  "summary": "One sentence description of what this document is"
}`,
            config: {
                maxOutputTokens: 400,
                responseMimeType: 'application/json',
            },
        })

        const text = response.text ?? '{}'

        // responseMimeType returns pure JSON; keep a regex fallback just in case.
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
            category: 'OTHER',
            confidence: 0.5,
            summary: 'Unable to classify document',
        }

        return NextResponse.json({ ...result, success: true })
    } catch (error) {
        console.error('Document classifier error:', error)
        return NextResponse.json({ error: 'Failed to classify document' }, { status: 500 })
    }
}
