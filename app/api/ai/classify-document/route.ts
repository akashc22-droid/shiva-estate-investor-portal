import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fileName, mimeType, fileContent } = body

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 200,
            messages: [{
                role: 'user',
                content: `Classify this real estate document and extract key information.

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
            }],
        })

        const text = message.content[0].type === 'text' ? message.content[0].text : '{}'

        // Parse JSON from Claude's response
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
