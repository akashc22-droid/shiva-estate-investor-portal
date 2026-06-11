import { GoogleGenAI } from '@google/genai'

/**
 * lib/ai/gemini.ts — Google Gemini client + shared prompts.
 *
 * Replaces the previous Anthropic Claude integration. The Vercel project sets
 * the key as `Gemini_API_KEY`; we also accept the conventional `GEMINI_API_KEY`
 * so either naming works. Prefer `GEMINI_API_KEY` going forward.
 */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? process.env.Gemini_API_KEY

/** True when a Gemini key is present — routes guard on this to fail cleanly. */
export const isGeminiConfigured = !!GEMINI_API_KEY

const globalForGemini = globalThis as unknown as { gemini: GoogleGenAI | undefined }

export const gemini =
    globalForGemini.gemini ?? new GoogleGenAI({ apiKey: GEMINI_API_KEY ?? '' })

if (process.env.NODE_ENV !== 'production') globalForGemini.gemini = gemini

/** Fast, low-cost model — well suited to these short generation tasks. */
export const GEMINI_MODEL = 'gemini-2.5-flash'

export const SYSTEM_PROMPTS = {
    returnPredictor: `You are a real estate investment analyst specializing in the Indian residential market.
Analyze investment data and provide detailed return predictions with reasoning.
Always ground analysis in specific micro-market data, RERA compliance score, and construction progress.
Be specific with numbers. Format clearly. Use Indian numbering (lakhs, crores).
Keep your response concise but insightful — 200-250 words.`,

    documentClassifier: `You are an expert in Indian real estate documentation.
Classify documents and extract key fields.
Always return valid JSON with: documentType, extractedData (containing dates, amounts, unit numbers, party names, RERA references), and confidence (0-1).`,

    updateGenerator: `You are an expert real estate communications writer for Indian property developers.
Generate professional, transparent construction progress updates for investors.
Tone: confident, transparent, forward-looking.
Include specific progress numbers and mention the next milestone.
Keep to 150-200 words. Write in a way that builds investor confidence.`,
}
