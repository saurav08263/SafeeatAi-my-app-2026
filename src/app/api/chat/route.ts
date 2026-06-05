import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/gemini'

const CHAT_SYSTEM_PROMPT = `You are SafeEat AI, a friendly and knowledgeable food safety assistant. You help users with questions about food safety, nutrition, food combinations, allergens, and dietary concerns.

Your expertise includes:
1. Food safety and hygiene
2. Food combinations and compatibility (Ayurvedic and modern science)
3. Allergen identification and management
4. Dietary restrictions and special diets
5. Food expiry and storage
6. Medicine-food interactions
7. Pregnancy and children's food safety
8. Nutrition and healthy eating

Guidelines:
- Be concise but thorough in your answers
- Cite scientific or traditional evidence when relevant
- Always err on the side of caution for safety questions
- If unsure, recommend consulting a healthcare professional
- Use a warm, professional tone
- Format your responses clearly with bullet points when helpful
- Keep responses under 200 words unless more detail is requested

You are NOT a replacement for professional medical advice. Always include a disclaimer when discussing serious health concerns.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { message, history } = body as {
      message?: string
      history?: Array<{ role: string; content: string }>
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const messages: Array<{
      role: 'assistant' | 'user'
      content: string
    }> = [
      {
        role: 'assistant',
        content: CHAT_SYSTEM_PROMPT,
      },
    ]

    if (history?.length) {
      const recentHistory = history.slice(-6)

      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })
        }
      }
    }

    messages.push({
      role: 'user',
      content: message,
    })

    const prompt = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n\n')

    const aiMessage = await generateText(prompt)

    return NextResponse.json({
      success: true,
      message: aiMessage,
    })
  } catch (error) {
    console.error('Chat error:', error)

    const errMsg =
      error instanceof Error
        ? error.message
        : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process your message',
        message: 'AI service error',
        details: errMsg,
      },
      { status: 500 }
    )
  }
}