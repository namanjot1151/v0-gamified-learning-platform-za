import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { subject, difficulty, count = 5, previousQuestions = [] } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      // Fallback to predefined questions
      return NextResponse.json({
        questions: generateFallbackQuestions(subject, difficulty, count),
      })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Generate ${count} unique ${difficulty} level ${subject} questions for rural students. 

Requirements:
- Multiple choice with 4 options (A, B, C, D)
- Include correct answer
- Add brief explanation
- Make questions practical and relatable
- Avoid these previous questions: ${previousQuestions.join(", ")}

Format as JSON array:
[
  {
    "question": "Question text",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correct": "A",
    "explanation": "Brief explanation why this is correct"
  }
]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0])
      return NextResponse.json({ questions })
    }

    // Fallback if parsing fails
    return NextResponse.json({
      questions: generateFallbackQuestions(subject, difficulty, count),
    })
  } catch (error) {
    console.error("Question generation error:", error)
    return NextResponse.json({
      questions: generateFallbackQuestions("Math", "easy", 5), // Default values for subject, difficulty, and count
    })
  }
}

function generateFallbackQuestions(subject: string, difficulty: string, count: number) {
  const questionBank = {
    Math: [
      {
        question: "What is 15 + 27?",
        options: ["A) 42", "B) 41", "C) 43", "D) 40"],
        correct: "A",
        explanation: "15 + 27 = 42. Add the ones place: 5 + 7 = 12, carry 1. Add tens: 1 + 2 + 1 = 4.",
      },
      {
        question: "If a farmer has 24 chickens and sells 8, how many are left?",
        options: ["A) 15", "B) 16", "C) 17", "D) 18"],
        correct: "B",
        explanation: "24 - 8 = 16. Subtraction: 24 chickens minus 8 sold equals 16 remaining.",
      },
      {
        question: "What is 12 × 8?",
        options: ["A) 94", "B) 96", "C) 98", "D) 100"],
        correct: "B",
        explanation: "12 × 8 = 96. You can break it down: 12 × 8 = (10 × 8) + (2 × 8) = 80 + 16 = 96.",
      },
      {
        question: "What is 144 ÷ 12?",
        options: ["A) 10", "B) 11", "C) 12", "D) 13"],
        correct: "C",
        explanation: "144 ÷ 12 = 12. Think: 12 × 12 = 144, so 144 ÷ 12 = 12.",
      },
      {
        question: "What is 25% of 80?",
        options: ["A) 15", "B) 20", "C) 25", "D) 30"],
        correct: "B",
        explanation: "25% of 80 = 0.25 × 80 = 20. Or think: 25% = 1/4, so 80 ÷ 4 = 20.",
      },
    ],
    Science: [
      {
        question: "What do plants need to make their own food?",
        options: ["A) Only water", "B) Sunlight, water, and carbon dioxide", "C) Only soil", "D) Only air"],
        correct: "B",
        explanation: "Plants use photosynthesis, which requires sunlight, water, and carbon dioxide to make glucose.",
      },
      {
        question: "What gas do we breathe in?",
        options: ["A) Carbon dioxide", "B) Nitrogen", "C) Oxygen", "D) Hydrogen"],
        correct: "C",
        explanation: "We breathe in oxygen (O₂) which our body needs for cellular respiration.",
      },
      {
        question: "What is the chemical symbol for water?",
        options: ["A) H₂O", "B) CO₂", "C) NaCl", "D) O₂"],
        correct: "A",
        explanation: "Water is H₂O - two hydrogen atoms bonded to one oxygen atom.",
      },
      {
        question: "Which planet is closest to the Sun?",
        options: ["A) Venus", "B) Earth", "C) Mercury", "D) Mars"],
        correct: "C",
        explanation: "Mercury is the closest planet to the Sun in our solar system.",
      },
      {
        question: "What force pulls objects toward Earth?",
        options: ["A) Magnetism", "B) Gravity", "C) Friction", "D) Electricity"],
        correct: "B",
        explanation: "Gravity is the force that pulls all objects toward the center of Earth.",
      },
    ],
    English: [
      {
        question: "Which is the correct plural of 'child'?",
        options: ["A) childs", "B) childes", "C) children", "D) child's"],
        correct: "C",
        explanation: "'Children' is the irregular plural form of 'child'. Not all plurals follow the -s rule.",
      },
      {
        question: "What is a synonym for 'happy'?",
        options: ["A) Sad", "B) Joyful", "C) Angry", "D) Tired"],
        correct: "B",
        explanation: "Joyful means the same as happy - both describe a positive, cheerful feeling.",
      },
      {
        question: "Which sentence is correct?",
        options: [
          "A) She don't like apples",
          "B) She doesn't like apples",
          "C) She not like apples",
          "D) She no like apples",
        ],
        correct: "B",
        explanation: "'She doesn't like apples' is correct. Use 'doesn't' (does not) with singular subjects.",
      },
      {
        question: "What type of word is 'quickly'?",
        options: ["A) Noun", "B) Verb", "C) Adjective", "D) Adverb"],
        correct: "D",
        explanation: "'Quickly' is an adverb because it describes how an action is performed (ends in -ly).",
      },
      {
        question: "Which is the past tense of 'go'?",
        options: ["A) Goes", "B) Going", "C) Went", "D) Gone"],
        correct: "C",
        explanation: "'Went' is the past tense of 'go'. It's an irregular verb that doesn't follow the -ed pattern.",
      },
    ],
    History: [
      {
        question: "When did World War II end?",
        options: ["A) 1944", "B) 1945", "C) 1946", "D) 1947"],
        correct: "B",
        explanation: "World War II ended in 1945 when Japan surrendered after the atomic bombs.",
      },
      {
        question: "Who was the first President of the United States?",
        options: ["A) John Adams", "B) George Washington", "C) Thomas Jefferson", "D) Benjamin Franklin"],
        correct: "B",
        explanation: "George Washington was the first President of the United States (1789-1797).",
      },
      {
        question: "Which ancient wonder was located in Egypt?",
        options: [
          "A) Hanging Gardens",
          "B) Colossus of Rhodes",
          "C) Great Pyramid of Giza",
          "D) Lighthouse of Alexandria",
        ],
        correct: "C",
        explanation: "The Great Pyramid of Giza is the only ancient wonder still standing today, located in Egypt.",
      },
      {
        question: "In which year did the American Civil War begin?",
        options: ["A) 1860", "B) 1861", "C) 1862", "D) 1863"],
        correct: "B",
        explanation: "The American Civil War began in 1861 and lasted until 1865.",
      },
      {
        question: "Who wrote the Declaration of Independence?",
        options: ["A) George Washington", "B) John Adams", "C) Thomas Jefferson", "D) Benjamin Franklin"],
        correct: "C",
        explanation: "Thomas Jefferson was the primary author of the Declaration of Independence in 1776.",
      },
    ],
    Geography: [
      {
        question: "What is the capital of Australia?",
        options: ["A) Sydney", "B) Melbourne", "C) Canberra", "D) Perth"],
        correct: "C",
        explanation: "Canberra is the capital of Australia, even though Sydney and Melbourne are larger cities.",
      },
      {
        question: "Which is the largest continent?",
        options: ["A) Africa", "B) Asia", "C) Europe", "D) North America"],
        correct: "B",
        explanation: "Asia is the largest continent by both area and population.",
      },
      {
        question: "What is the longest river in the world?",
        options: ["A) Amazon River", "B) Nile River", "C) Mississippi River", "D) Yangtze River"],
        correct: "B",
        explanation: "The Nile River in Africa is the longest river in the world at about 4,135 miles.",
      },
      {
        question: "Which mountain range contains Mount Everest?",
        options: ["A) Rocky Mountains", "B) Andes", "C) Alps", "D) Himalayas"],
        correct: "D",
        explanation: "Mount Everest, the world's highest peak, is located in the Himalayas.",
      },
      {
        question: "What is the smallest country in the world?",
        options: ["A) Monaco", "B) Vatican City", "C) San Marino", "D) Liechtenstein"],
        correct: "B",
        explanation: "Vatican City is the smallest country in the world by both area and population.",
      },
    ],
    Physics: [
      {
        question: "What is the speed of light?",
        options: ["A) 300,000 km/s", "B) 299,792,458 m/s", "C) 186,000 miles/s", "D) All of the above"],
        correct: "D",
        explanation:
          "The speed of light is approximately 299,792,458 m/s, which equals about 300,000 km/s or 186,000 miles/s.",
      },
      {
        question: "What unit measures electric current?",
        options: ["A) Volt", "B) Watt", "C) Ampere", "D) Ohm"],
        correct: "C",
        explanation: "Electric current is measured in amperes (amps), named after André-Marie Ampère.",
      },
      {
        question: "What happens to water at 100°C?",
        options: ["A) It freezes", "B) It boils", "C) It melts", "D) Nothing"],
        correct: "B",
        explanation: "Water boils at 100°C (212°F) at standard atmospheric pressure.",
      },
      {
        question: "What is Newton's first law of motion?",
        options: ["A) F = ma", "B) Objects at rest stay at rest", "C) Action-reaction", "D) E = mc²"],
        correct: "B",
        explanation:
          "Newton's first law states that objects at rest stay at rest and objects in motion stay in motion unless acted upon by a force.",
      },
    ],
    Chemistry: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["A) Go", "B) Au", "C) Ag", "D) Al"],
        correct: "B",
        explanation: "Gold's chemical symbol is Au, from the Latin word 'aurum' meaning gold.",
      },
      {
        question: "How many protons does carbon have?",
        options: ["A) 4", "B) 6", "C) 8", "D) 12"],
        correct: "B",
        explanation: "Carbon has 6 protons, which defines it as element number 6 on the periodic table.",
      },
      {
        question: "What gas makes up most of Earth's atmosphere?",
        options: ["A) Oxygen", "B) Carbon dioxide", "C) Nitrogen", "D) Hydrogen"],
        correct: "C",
        explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen is about 21%.",
      },
    ],
    Biology: [
      {
        question: "What is the powerhouse of the cell?",
        options: ["A) Nucleus", "B) Mitochondria", "C) Ribosome", "D) Chloroplast"],
        correct: "B",
        explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP (energy).",
      },
      {
        question: "How many chambers does a human heart have?",
        options: ["A) 2", "B) 3", "C) 4", "D) 5"],
        correct: "C",
        explanation: "The human heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower).",
      },
      {
        question: "What type of blood cells fight infection?",
        options: ["A) Red blood cells", "B) White blood cells", "C) Platelets", "D) Plasma"],
        correct: "B",
        explanation: "White blood cells (leukocytes) are part of the immune system and fight infections.",
      },
    ],
  }

  const subjectQuestions = questionBank[subject as keyof typeof questionBank] || questionBank.Math
  const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
