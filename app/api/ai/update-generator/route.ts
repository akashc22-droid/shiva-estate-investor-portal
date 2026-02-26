import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { projectId, milestones, progress, lastUpdateDate } = body

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 400,
            system: `You are an expert real estate communications writer for Indian property developers.
Generate professional, transparent construction progress updates for investors.
Tone: confident, transparent, forward-looking. Include specific progress numbers and mention the next milestone.
Keep to 150-200 words. Write in a way that builds investor confidence.`,
            messages: [{
                role: 'user',
                content: `Generate a construction update for:
Project Progress: ${progress}% overall complete
Latest completed: ${milestones?.completed ?? '11th-15th Floor Slabs'}
Currently in progress: ${milestones?.inProgress ?? '16th-20th Floor Slabs (72% complete)'}
Next milestone: ${milestones?.next ?? 'Completion of 20th floor slabs by April 2025'}
Last update was: ${lastUpdateDate ?? '45 days ago'}

Write a professional investor update with a specific heading date line.`,
            }],
        })

        const text = message.content[0].type === 'text' ? message.content[0].text : ''
        return NextResponse.json({ text, success: true })
    } catch (error) {
        console.error('Update generator error:', error)
        return NextResponse.json({ error: 'Failed to generate update' }, { status: 500 })
    }
}
