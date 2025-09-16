import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { action, gameData } = await request.json()

    switch (action) {
      case "generate_words":
        return await generateScrambledWords(gameData)
      case "check_answer":
        return await checkWordAnswer(gameData)
      case "get_hint":
        return await getWordHint(gameData)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Word scramble API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateScrambledWords(gameData: any) {
  const { subject, difficulty, wordCount = 5 } = gameData

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Generate ${wordCount} educational words related to ${subject} at ${difficulty} level.
  For each word, provide: original word, scrambled version, and a helpful hint.
  Format: {"word": "EDUCATION", "scrambled": "NOITACUDE", "hint": "Learning process"}
  Return as JSON array.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    const words = JSON.parse(text.replace(/```json\n?|\n?```/g, ""))
    return NextResponse.json({ words })
  } catch (parseError) {
    // Fallback words
    const fallbackWords = [
      { word: "EDUCATION", scrambled: "NOITACUDE", hint: "Learning process" },
      { word: "KNOWLEDGE", scrambled: "EGDELWONK", hint: "Information and skills" },
      { word: "STUDENT", scrambled: "TNEDUTS", hint: "Person who learns" },
    ]
    return NextResponse.json({ words: fallbackWords })
  }
}

async function checkWordAnswer(gameData: any) {
  const { userAnswer, correctWord } = gameData

  const isCorrect = userAnswer.toLowerCase().trim() === correctWord.toLowerCase().trim()
  const points = isCorrect ? 15 : 0

  return NextResponse.json({
    isCorrect,
    points,
    message: isCorrect ? "Excellent! You unscrambled it!" : `Not quite. The word was: ${correctWord}`,
  })
}

async function getWordHint(gameData: any) {
  const { word, currentHint } = gameData

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Provide an additional helpful hint for the word "${word}". 
  Current hint: "${currentHint}"
  Give a different, more specific clue without revealing the word directly.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const additionalHint = response.text().trim()

  return NextResponse.json({ hint: additionalHint })
}
