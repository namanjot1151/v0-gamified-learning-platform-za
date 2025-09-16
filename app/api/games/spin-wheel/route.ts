import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { action, gameData } = await request.json()

    switch (action) {
      case "generate_questions":
        return await generateSpinQuestions(gameData)
      case "validate_answer":
        return await validateAnswer(gameData)
      case "save_spin_result":
        return await saveSpinResult(gameData)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Spin wheel API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateSpinQuestions(gameData: any) {
  const { subjects, difficulty } = gameData

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Generate 3 multiple choice questions for each subject: ${subjects.join(", ")}.
  Difficulty: ${difficulty}
  Format: {"subject": "Math", "question": "What is 2+2?", "answer": "4", "options": ["3", "4", "5", "6"]}
  Return as JSON array of questions.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    const questions = JSON.parse(text.replace(/```json\n?|\n?```/g, ""))
    return NextResponse.json({ questions })
  } catch (parseError) {
    // Fallback questions
    const fallbackQuestions = [
      {
        subject: "Math",
        question: "What is 12 × 8?",
        answer: "96",
        options: ["94", "96", "98", "100"],
      },
      {
        subject: "Science",
        question: "What gas do plants absorb?",
        answer: "carbon dioxide",
        options: ["oxygen", "carbon dioxide", "nitrogen", "hydrogen"],
      },
    ]
    return NextResponse.json({ questions: fallbackQuestions })
  }
}

async function validateAnswer(gameData: any) {
  const { userAnswer, correctAnswer, isBonus } = gameData

  const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
  const points = isCorrect ? (isBonus ? 20 : 10) : 0

  return NextResponse.json({
    isCorrect,
    points,
    message: isCorrect ? "Correct! Well done!" : `Incorrect. The answer was: ${correctAnswer}`,
  })
}

async function saveSpinResult(gameData: any) {
  const { userId, totalScore, questionsAnswered, correctAnswers } = gameData

  // In a real app, save to database
  return NextResponse.json({
    success: true,
    finalScore: totalScore,
    accuracy: Math.round((correctAnswers / questionsAnswered) * 100),
  })
}
