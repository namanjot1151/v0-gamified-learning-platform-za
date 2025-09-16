import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({
        response:
          "I'm sorry, but the AI assistant is not configured. Please add your Gemini API key to use this feature.",
      })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `You are an AI learning assistant for a gamified education platform focused on rural education. You help students with:

1. **Subject Help**: Math, Science, English, History, Geography, Computer Science
2. **Learning Guidance**: Study tips, concept explanations, problem-solving
3. **Game Assistance**: Help with educational games and quizzes
4. **Motivation**: Encourage students and provide positive reinforcement

Guidelines:
- Be encouraging and supportive
- Explain concepts in simple, clear language
- Use examples relevant to rural students
- Suggest related games or activities on the platform
- Keep responses concise but helpful
- If asked about complex topics, break them down into smaller parts

Context: ${context || "General learning assistance"}

Student Question: ${message}`

    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({
      response:
        "I'm having trouble processing your request right now. Please try asking your question again, or try one of our educational games while I get back online!",
    })
  }
}
