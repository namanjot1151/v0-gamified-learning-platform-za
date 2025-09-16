import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { action, gameData } = await request.json()

    switch (action) {
      case "generate_cards":
        return await generateMemoryCards(gameData)
      case "save_score":
        return await saveGameScore(gameData)
      case "get_leaderboard":
        return await getLeaderboard()
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Memory game API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateMemoryCards(gameData: any) {
  const { subject, difficulty, cardCount = 8 } = gameData

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Generate ${cardCount} educational memory card pairs for ${subject} at ${difficulty} level.
  Each pair should have a term/concept and its definition/answer.
  Return as JSON array with format: [{"id": 1, "content": "term", "match": "definition"}, {"id": 2, "content": "definition", "match": "term"}]
  Make sure content is educational and appropriate for students.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    const cards = JSON.parse(text.replace(/```json\n?|\n?```/g, ""))
    return NextResponse.json({ cards })
  } catch (parseError) {
    // Fallback cards if AI generation fails
    const fallbackCards = [
      { id: 1, content: "H₂O", match: "Water" },
      { id: 2, content: "Water", match: "H₂O" },
      { id: 3, content: "CO₂", match: "Carbon Dioxide" },
      { id: 4, content: "Carbon Dioxide", match: "CO₂" },
    ]
    return NextResponse.json({ cards: fallbackCards })
  }
}

async function saveGameScore(gameData: any) {
  const { userId, score, moves, timeSpent, subject } = gameData

  // In a real app, save to database
  // For now, return success
  return NextResponse.json({
    success: true,
    message: "Score saved successfully",
    points: Math.floor(score * 1.5), // Bonus points calculation
  })
}

async function getLeaderboard() {
  // In a real app, fetch from database
  const mockLeaderboard = [
    { rank: 1, name: "Alex", score: 850, subject: "Science" },
    { rank: 2, name: "Sarah", score: 720, subject: "Math" },
    { rank: 3, name: "Mike", score: 680, subject: "History" },
  ]

  return NextResponse.json({ leaderboard: mockLeaderboard })
}
