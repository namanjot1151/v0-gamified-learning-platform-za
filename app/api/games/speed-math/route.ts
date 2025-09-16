import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { action, gameData } = await request.json()

    switch (action) {
      case "generate_problems":
        return await generateMathProblems(gameData)
      case "check_answer":
        return await checkMathAnswer(gameData)
      case "get_next_level":
        return await getNextLevel(gameData)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Speed math API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateMathProblems(gameData: any) {
  const { level, difficulty, problemCount = 5 } = gameData

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Generate ${problemCount} math problems for level ${level} at ${difficulty} difficulty.
  Include: arithmetic, algebra, geometry problems appropriate for the level.
  Format: {"question": "15 + 27 = ?", "answer": "42", "type": "arithmetic", "timeLimit": 30}
  Return as JSON array.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    const problems = JSON.parse(text.replace(/```json\n?|\n?```/g, ""))
    return NextResponse.json({ problems })
  } catch (parseError) {
    // Fallback problems
    const fallbackProblems = [
      { question: "15 + 27 = ?", answer: "42", type: "arithmetic", timeLimit: 30 },
      { question: "8 × 9 = ?", answer: "72", type: "arithmetic", timeLimit: 25 },
      { question: "144 ÷ 12 = ?", answer: "12", type: "arithmetic", timeLimit: 20 },
    ]
    return NextResponse.json({ problems: fallbackProblems })
  }
}

async function checkMathAnswer(gameData: any) {
  const { userAnswer, correctAnswer, timeSpent, timeLimit } = gameData

  const isCorrect = Number.parseFloat(userAnswer) === Number.parseFloat(correctAnswer)
  const speedBonus = Math.max(0, Math.floor((timeLimit - timeSpent) / 2))
  const points = isCorrect ? 10 + speedBonus : 0

  return NextResponse.json({
    isCorrect,
    points,
    speedBonus,
    message: isCorrect ? `Correct! +${speedBonus} speed bonus` : `Incorrect. Answer: ${correctAnswer}`,
  })
}

async function getNextLevel(gameData: any) {
  const { currentLevel, score, accuracy } = gameData

  const canAdvance = accuracy >= 70 && score >= currentLevel * 50
  const nextLevel = canAdvance ? currentLevel + 1 : currentLevel

  return NextResponse.json({
    canAdvance,
    nextLevel,
    message: canAdvance ? "Level up! Great job!" : "Keep practicing to advance!",
  })
}
