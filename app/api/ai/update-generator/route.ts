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
        const { milestones, progress, lastUpdateDate } = body

        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: `Generate a construction update for:
Project Progress: ${progress}% overall complete
Latest completed: ${milestones?.completed ?? '11th-15th Floor Slabs'}
Currently in progress: ${milestones?.inProgress ?? '16th-20th Floor Slabs (72% complete)'}
Next milestone: ${milestones?.next ?? 'Completion of 20th floor slabs by April 2025'}
Last update was: ${lastUpdateDate ?? '45 days ago'}

Write a professional investor update with a specific heading date line.`,
            config: {
                systemInstruction: SYSTEM_PROMPTS.updateGenerator,
                maxOutputTokens: 400,
            },
        })

        const text = response.text ?? ''
        return NextResponse.json({ text, success: true })
    } catch (error) {
        console.error('Update generator error:', error)
        return NextResponse.json({ error: 'Failed to generate update' }, { status: 500 })
    }
}
