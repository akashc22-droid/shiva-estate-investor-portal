import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a real estate investment analyst specializing in the Indian residential market.
Analyze investment data and provide detailed return predictions with reasoning.
Always ground analysis in specific micro-market data, RERA compliance score, and construction progress.
Be specific with numbers. Use Indian numbering (lakhs, crores). Keep to 200-250 words.`

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { investmentData } = body

        const userMessage = `Analyze this investment:
Project: ${investmentData?.projectName ?? 'ShivaOS Skyline'}
Location: ${investmentData?.location ?? 'Kokapet, Hyderabad'}
Unit: ${investmentData?.unit ?? '2BHK, 1200 sqft, Unit A-1204'}
Invested: ₹${investmentData?.investedAmount ?? '1,20,00,000'}
Progress: ${investmentData?.progress ?? 68}% complete
RERA Number: ${investmentData?.reraNumber ?? 'P02400001234'}
Expected Possession: ${investmentData?.possessionDate ?? 'March 2026'}
Comparable market rate: ₹7,200/sqft (current) in Kokapet micro-market

Provide return prediction with specific numbers, reasoning, and confidence level.`

        const stream = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userMessage }],
            stream: true,
        })

        const encoder = new TextEncoder()

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const event of stream) {
                        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                            controller.enqueue(encoder.encode(event.delta.text))
                        }
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
