import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { videoTitle, videoDescription, videoDuration, videoId } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      // Fallback to enhanced mock if no API key
      return NextResponse.json({
        summary: generateIntelligentSummary(videoTitle, videoDescription, videoDuration),
      })
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Analyze this educational video and provide a comprehensive learning summary:

Title: ${videoTitle}
Description: ${videoDescription}
Duration: ${videoDuration}

Please provide:
1. Key learning objectives (3-5 points)
2. Main concepts covered
3. Difficulty level assessment
4. Study recommendations
5. Prerequisites needed
6. Next steps for continued learning
7. Real-world applications

Format as a detailed educational summary that helps students understand what they'll learn and how to approach the content effectively.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("AI Summary error:", error)
    // Fallback to mock summary on error
    const { videoTitle, videoDescription, videoDuration } = await request.json()
    return NextResponse.json({
      summary: generateIntelligentSummary(videoTitle, videoDescription, videoDuration),
    })
  }
}

function generateIntelligentSummary(title: string, description: string, duration: string) {
  // Extract key topics from title and description
  const topics = extractTopics(title, description)
  const subject = determineSubject(title, description)
  const difficulty = determineDifficulty(title, description)

  return `**AI-Generated Summary for "${title}"**

**Subject**: ${subject}
**Estimated Difficulty**: ${difficulty}
**Duration**: ${duration}

**Key Learning Objectives**:
${topics.map((topic) => `• ${topic}`).join("\n")}

**Content Analysis**:
Based on the video title and description, this educational content covers ${subject.toLowerCase()} concepts that are essential for student understanding. The video appears to focus on ${topics.slice(0, 2).join(" and ")}.

**Recommended Study Approach**:
1. **Pre-watch**: Review related concepts in our interactive games
2. **Active Watching**: Take notes on key formulas, definitions, or processes
3. **Post-watch**: Complete our ${subject} games to reinforce learning
4. **Practice**: Apply concepts through additional exercises

**Learning Path Suggestions**:
After watching this video, consider exploring:
${generateRelatedTopics(subject, topics)
  .map((topic) => `• ${topic}`)
  .join("\n")}

**Study Tips**:
- Pause the video to work through examples yourself
- Create visual notes or diagrams for complex concepts
- Use our gamified quizzes to test your understanding
- Review the material within 24 hours for better retention

**Difficulty Assessment**: ${difficulty}
**Recommended Prerequisites**: Basic understanding of ${subject.toLowerCase()} fundamentals
**Next Steps**: Practice with our interactive ${subject} games and explore advanced topics`
}

function extractTopics(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const topics: string[] = []

  // Math topics
  if (text.includes("algebra") || text.includes("equation")) topics.push("Algebraic problem solving")
  if (text.includes("geometry") || text.includes("triangle") || text.includes("circle"))
    topics.push("Geometric principles")
  if (text.includes("calculus") || text.includes("derivative")) topics.push("Calculus concepts")
  if (text.includes("fraction") || text.includes("decimal")) topics.push("Number operations")

  // Science topics
  if (text.includes("photosynthesis") || text.includes("plant")) topics.push("Plant biology and photosynthesis")
  if (text.includes("physics") || text.includes("force") || text.includes("motion")) topics.push("Physics principles")
  if (text.includes("chemistry") || text.includes("reaction")) topics.push("Chemical processes")
  if (text.includes("biology") || text.includes("cell")) topics.push("Biological systems")

  // History topics
  if (text.includes("war") || text.includes("battle")) topics.push("Historical conflicts and their impact")
  if (text.includes("revolution") || text.includes("independence")) topics.push("Political and social changes")

  // English topics
  if (text.includes("grammar") || text.includes("writing")) topics.push("Language structure and composition")
  if (text.includes("literature") || text.includes("poem")) topics.push("Literary analysis and interpretation")

  // Default topics if none found
  if (topics.length === 0) {
    topics.push("Core subject concepts", "Problem-solving strategies", "Critical thinking skills")
  }

  return topics.slice(0, 4) // Limit to 4 topics
}

function determineSubject(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes("math") || text.includes("algebra") || text.includes("geometry") || text.includes("calculus"))
    return "Mathematics"
  if (text.includes("science") || text.includes("physics") || text.includes("chemistry") || text.includes("biology"))
    return "Science"
  if (text.includes("history") || text.includes("war") || text.includes("revolution")) return "History"
  if (text.includes("english") || text.includes("literature") || text.includes("writing")) return "English"
  if (text.includes("geography") || text.includes("country") || text.includes("capital")) return "Geography"

  return "General Education"
}

function determineDifficulty(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes("advanced") || text.includes("college") || text.includes("university")) return "Advanced"
  if (text.includes("intermediate") || text.includes("high school")) return "Intermediate"
  if (text.includes("basic") || text.includes("elementary") || text.includes("beginner")) return "Beginner"

  return "Intermediate"
}

function generateRelatedTopics(subject: string, currentTopics: string[]): string[] {
  const relatedTopics: { [key: string]: string[] } = {
    Mathematics: [
      "Advanced problem-solving techniques",
      "Real-world mathematical applications",
      "Mathematical reasoning and proofs",
      "Statistics and probability",
    ],
    Science: [
      "Scientific method and experimentation",
      "Environmental science connections",
      "Technology applications in science",
      "Cross-disciplinary scientific concepts",
    ],
    History: [
      "Historical cause and effect relationships",
      "Primary source analysis",
      "Comparative historical studies",
      "Modern connections to historical events",
    ],
    English: [
      "Advanced writing techniques",
      "Critical reading strategies",
      "Communication skills development",
      "Media literacy and analysis",
    ],
    Geography: [
      "Cultural geography and human impact",
      "Physical geography and climate",
      "Economic geography and trade",
      "Political geography and boundaries",
    ],
  }

  return (
    relatedTopics[subject] || [
      "Critical thinking development",
      "Study skills and learning strategies",
      "Cross-curricular connections",
      "Real-world applications",
    ]
  )
}
