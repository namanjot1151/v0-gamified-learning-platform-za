import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({
        response:
          "I'm here to help with your learning! However, I need an API key to provide personalized assistance. For now, I can suggest checking out our interactive games and video recommendations to continue your studies!",
      })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const systemPrompt = `You are an AI learning assistant for a gamified education platform designed for rural students. You help with:

- Explaining complex concepts in simple terms
- Providing study tips and learning strategies
- Recommending games and activities
- Answering subject-specific questions (Math, Science, English, History, Geography)
- Motivating students and celebrating their progress
- Suggesting next steps in their learning journey

Keep responses encouraging, educational, and age-appropriate. Use simple language and provide practical examples when possible.

Student context: ${context || "General learning assistance"}
Student question: ${message}`

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const assistantResponse = response.text()

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error("AI Assistant error:", error)
    return NextResponse.json(
      {
        response:
          "I'm having trouble connecting right now, but I'm here to help! Try asking about specific subjects like math, science, or any learning topic you're curious about.",
      },
      { status: 500 },
    )
  }
}
