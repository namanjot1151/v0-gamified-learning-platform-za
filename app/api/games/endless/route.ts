import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Track used questions to prevent repetition
const usedQuestions = new Map<string, Set<string>>()

const fallbackQuestions = {
  simulation: {
    science: [
      {
        question: "What happens when you mix baking soda and vinegar?",
        answer: "Chemical reaction",
        options: ["Chemical reaction", "Physical change", "No reaction", "Explosion"],
        explanation: "Creates CO2 gas bubbles",
        difficulty: 1,
      },
      {
        question: "Which gas do plants absorb during photosynthesis?",
        answer: "Carbon dioxide",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        explanation: "Plants use CO2 to make glucose",
        difficulty: 2,
      },
      {
        question: "What is the pH of pure water?",
        answer: "7",
        options: ["6", "7", "8", "9"],
        explanation: "Pure water is neutral with pH 7",
        difficulty: 3,
      },
    ],
  },
  puzzle: {
    english: [
      { word: "EDUCATION", scrambled: "NOITACUDE", hint: "Learning process", type: "anagram", difficulty: 1 },
      { word: "KNOWLEDGE", scrambled: "EGDELWONK", hint: "Information and skills", type: "anagram", difficulty: 2 },
      { word: "UNDERSTANDING", scrambled: "GNIDNATSREDNU", hint: "Comprehension", type: "anagram", difficulty: 3 },
    ],
  },
  adventure: {
    history: [
      {
        era: "Ancient Egypt",
        clue: "Built massive tombs for pharaohs",
        question: "What are these structures called?",
        answer: "Pyramids",
        options: ["Pyramids", "Temples", "Palaces", "Monuments"],
        context: "Ancient burial sites",
        difficulty: 1,
      },
      {
        era: "Roman Empire",
        clue: "Gladiators fought here",
        question: "What is this arena called?",
        answer: "Colosseum",
        options: ["Colosseum", "Forum", "Circus", "Theater"],
        context: "Entertainment venue",
        difficulty: 2,
      },
    ],
  },
  exploration: {
    geography: [
      {
        region: "Africa",
        question: "What is the longest river in Africa?",
        answer: "Nile",
        options: ["Nile", "Congo", "Niger", "Zambezi"],
        difficulty: 1,
        fact: "The Nile is 6,650 km long",
      },
      {
        region: "Asia",
        question: "What is the highest mountain in the world?",
        answer: "Mount Everest",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
        difficulty: 2,
        fact: "Mount Everest is 8,848 meters tall",
      },
    ],
  },
  coding: {
    programming: [
      {
        task: "Print Hello World",
        code_example: "print('Hello World')",
        question: "What does this code do?",
        answer: "Prints text",
        options: ["Prints text", "Creates variable", "Loops code", "Defines function"],
        difficulty: 1,
      },
      {
        task: "Create a loop",
        code_example: "for i in range(5):",
        question: "How many times will this loop run?",
        answer: "5",
        options: ["4", "5", "6", "Infinite"],
        difficulty: 2,
      },
    ],
  },
}

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry on certain errors
      if (error instanceof Error && error.message.includes("overloaded")) {
        if (attempt === maxRetries - 1) break

        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }

  throw lastError!
}
// Base type for all fallback questions
type FallbackQuestion = {
  question: string
  answer: string
  options: string[]
  explanation?: string
  difficulty: number
  // Optional fields to support other game types
  task?: string
  code_example?: string
  clue?: string
  era?: string
  context?: string
  region?: string
  fact?: string
  word?: string
  scrambled?: string
  hint?: string
  type?: string
}


function getFallbackQuestion(gameType: string, subject: string, level: number) {
  const gameQuestions = fallbackQuestions[gameType as keyof typeof fallbackQuestions]
  if (!gameQuestions) return null

  let subjectQuestions = gameQuestions[subject as keyof typeof gameQuestions] as FallbackQuestion[]

  if (!Array.isArray(subjectQuestions)) {
    const fallbackSubjectKey = Object.keys(gameQuestions)[0] as keyof typeof gameQuestions
    subjectQuestions = gameQuestions[fallbackSubjectKey] as FallbackQuestion[]
  }

  if (!Array.isArray(subjectQuestions)) return null

  const questionIndex = (level - 1) % subjectQuestions.length
  const baseQuestion = subjectQuestions[questionIndex]

  return {
    ...baseQuestion,
    difficulty: Math.max(baseQuestion.difficulty, Math.ceil(level / 3)),
    question: baseQuestion.question || `Level ${level} ${subject} challenge`,
  }
}



export async function POST(request: NextRequest) {
  try {
    const { action, gameType, subject, level, usedQuestionIds = [] } = await request.json()

    if (action === "generate_questions") {
      // Create unique key for tracking
      const trackingKey = `${gameType}-${subject}-${level}`
      if (!usedQuestions.has(trackingKey)) {
        usedQuestions.set(trackingKey, new Set())
      }
      const usedSet = usedQuestions.get(trackingKey)!

      let questions

      try {
        questions = await retryWithBackoff(async () => {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

          let prompt = ""
          const questionCount = 1

          switch (gameType) {
            case "simulation":
              prompt = `Generate ${questionCount} unique science experiment questions for level ${level} in ${subject}. 
              Format as JSON with: question, answer, options (4 choices), explanation, difficulty.
              Make questions progressively harder with level. Avoid these used questions: ${Array.from(usedSet).join(", ")}`
              break

            case "puzzle":
              prompt = `Generate ${questionCount} unique word puzzle for level ${level} in ${subject}.
              Include: word, scrambled, hint, type (anagram/synonym/grammar), difficulty.
              Make progressively harder with level. Avoid: ${Array.from(usedSet).join(", ")}`
              break

            case "adventure":
              prompt = `Generate ${questionCount} unique historical mystery clue for level ${level} in ${subject}.
              Include: era, clue, question, answer, options (4 choices), context.
              Make progressively harder with level. Avoid: ${Array.from(usedSet).join(", ")}`
              break

            case "exploration":
              prompt = `Generate ${questionCount} unique geography challenge for level ${level} in ${subject}.
              Include: region, question, answer, options (4 choices), difficulty, fact.
              Make progressively harder with level. Avoid: ${Array.from(usedSet).join(", ")}`
              break

            case "coding":
              prompt = `Generate ${questionCount} unique coding challenge for level ${level} in ${subject}.
              Include: task, code_example, question, answer, options (4 choices), difficulty.
              Make progressively harder with level. Avoid: ${Array.from(usedSet).join(", ")}`
              break

            default:
              prompt = `Generate ${questionCount} unique educational question for level ${level} in ${subject}.
              Include: question, answer, options (4 choices), explanation, difficulty.
              Make progressively harder with level. Avoid: ${Array.from(usedSet).join(", ")}`
          }

          const result = await model.generateContent(prompt)
          const response = await result.response
          let text = response.text()

          // Clean up the response to extract JSON
          text = text
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim()

          const parsedQuestions = JSON.parse(text)
          return Array.isArray(parsedQuestions) ? parsedQuestions : [parsedQuestions]
        })
      } catch (error) {
        console.error("AI generation failed, using fallback:", error)
        const fallbackQuestion = getFallbackQuestion(gameType, subject, level)
        questions = fallbackQuestion
          ? [fallbackQuestion]
          : [
              {
                question: `Level ${level} question in ${subject}`,
                answer: "sample answer",
                options: ["option 1", "sample answer", "option 3", "option 4"],
                difficulty: level,
                explanation: "This is a sample question.",
              },
            ]
      }

      // Mark questions as used
      questions.forEach((q: any) => {
        const questionId = q.question?.substring(0, 50) || Math.random().toString()
        usedSet.add(questionId)
      })

      return NextResponse.json({
        questions,
        level,
        nextLevel: level + 1,
        totalUsed: usedSet.size,
      })
    }

    if (action === "validate_answer") {
      const { userAnswer, correctAnswer, timeSpent, level } = await request.json()
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

      // Calculate points based on level and time
      let points = 0
      if (isCorrect) {
        points = Math.max(10, 20 + level * 5 - Math.floor(timeSpent / 2))
      }

      return NextResponse.json({
        isCorrect,
        points,
        nextLevel: isCorrect ? level + 1 : level,
        feedback: isCorrect ? "Correct! Moving to next level!" : "Try again!",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Endless game API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        fallback: true,
      },
      { status: 500 },
    )
  }
}
