import { NextRequest, NextResponse } from 'next/server'
import { gemini, GEMINI_MODEL, SYSTEM_PROMPTS, isGeminiConfigured } from '@/lib/ai/gemini'

export async function POST(request: NextRequest) {
    try {
        if (!isGeminiConfigured) {
            return NextResponse.json(
                { error: 'AI is not configured. Set GEMINI_API_KEY in the environment.' },
                { status: 503 },
            )
        }

        const body = await request.json()
        const { investmentData } = body

        const userMessage = `Analyze this investment:
Project: ${investmentData?.projectName ?? 'Sankhedi Project'}
Location: ${investmentData?.location ?? 'Kolar Road, Near SAGE International School, Bhopal, MP'}
Unit: ${investmentData?.unit ?? 'Residential Plot SP-07, 1800 sqft'}
Invested: ₹${investmentData?.investedAmount ?? '75,00,000'}
Progress: ${investmentData?.progress ?? 55}% complete
RERA Number: ${investmentData?.reraNumber ?? 'P4500012345'}
Expected Possession: ${investmentData?.possessionDate ?? 'December 2026'}
Comparable market rate: ₹3,800/sqft (current) in Kolar Road micro-market, Bhopal

Provide return prediction with specific numbers, reasoning, and confidence level.`

        const stream = await gemini.models.generateContentStream({
            model: GEMINI_MODEL,
            contents: userMessage,
            config: {
                systemInstruction: SYSTEM_PROMPTS.returnPredictor,
                maxOutputTokens: 600,
            },
        })

        const encoder = new TextEncoder()

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.text
                        if (text) controller.enqueue(encoder.encode(text))
                    }
                } finally {
                    controller.close()
                }
            },
        })

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
            },
        })
    } catch (error) {
        console.error('Return predictor error:', error)
        return NextResponse.json({ error: 'Failed to generate prediction' }, { status: 500 })
    }
}
