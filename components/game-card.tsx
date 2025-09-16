"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Trophy, Star, Clock, Users } from "lucide-react"

export default function GameCard() {
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")

  const games = [
    {
      id: 1,
      title: "Math Quest Adventure",
      subject: "Mathematics",
      grade: "6-8",
      difficulty: "Medium",
      duration: "15 min",
      players: 1247,
      rating: 4.8,
      description: "Solve math problems to help the hero complete their quest!",
      icon: "🔢",
      color: "from-blue-500 to-cyan-500",
      questions: [
        {
          question: "What is 15 × 8?",
          options: ["120", "125", "115", "130"],
          correct: 0,
          explanation: "15 × 8 = 120. You can think of it as (10 × 8) + (5 × 8) = 80 + 40 = 120",
        },
        {
          question: "If a rectangle has length 12 cm and width 7 cm, what is its area?",
          options: ["84 cm²", "38 cm²", "19 cm²", "94 cm²"],
          correct: 0,
          explanation: "Area = length × width = 12 × 7 = 84 cm²",
        },
        {
          question: "What is 3/4 + 1/8?",
          options: ["7/8", "4/12", "1/2", "5/6"],
          correct: 0,
          explanation: "3/4 + 1/8 = 6/8 + 1/8 = 7/8",
        },
      ],
    },
    {
      id: 2,
      title: "Science Lab Explorer",
      subject: "Science",
      grade: "7-9",
      difficulty: "Hard",
      duration: "20 min",
      players: 892,
      rating: 4.9,
      description: "Conduct virtual experiments and discover scientific principles!",
      icon: "🔬",
      color: "from-green-500 to-emerald-500",
      questions: [
        {
          question: "What gas do plants absorb during photosynthesis?",
          options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
          correct: 1,
          explanation:
            "Plants absorb carbon dioxide (CO₂) from the air and use it with water and sunlight to make glucose.",
        },
        {
          question: "Which planet is closest to the Sun?",
          options: ["Venus", "Earth", "Mercury", "Mars"],
          correct: 2,
          explanation: "Mercury is the closest planet to the Sun, with an average distance of about 36 million miles.",
        },
      ],
    },
    {
      id: 3,
      title: "Word Wizard Challenge",
      subject: "English",
      grade: "5-7",
      difficulty: "Easy",
      duration: "10 min",
      players: 1563,
      rating: 4.7,
      description: "Master vocabulary and grammar through magical word challenges!",
      icon: "📚",
      color: "from-purple-500 to-pink-500",
      questions: [
        {
          question: 'Which word is a synonym for "happy"?',
          options: ["Sad", "Joyful", "Angry", "Tired"],
          correct: 1,
          explanation: "Joyful means feeling great pleasure and happiness, making it a synonym for happy.",
        },
        {
          question: 'What is the past tense of "run"?',
          options: ["Runned", "Ran", "Running", "Runs"],
          correct: 1,
          explanation: 'The past tense of "run" is "ran". For example: "Yesterday, I ran to school."',
        },
      ],
    },
    {
      id: 4,
      title: "History Time Machine",
      subject: "History",
      grade: "8-10",
      difficulty: "Medium",
      duration: "25 min",
      players: 734,
      rating: 4.6,
      description: "Travel through time and experience historical events firsthand!",
      icon: "🏛️",
      color: "from-orange-500 to-red-500",
      questions: [
        {
          question: "In which year did World War II end?",
          options: ["1944", "1945", "1946", "1943"],
          correct: 1,
          explanation: "World War II ended in 1945 with the surrender of Japan in September.",
        },
      ],
    },
    {
      id: 5,
      title: "Geography Explorer",
      subject: "Geography",
      grade: "6-9",
      difficulty: "Medium",
      duration: "18 min",
      players: 1089,
      rating: 4.8,
      description: "Explore the world and learn about countries, capitals, and landmarks!",
      icon: "🌍",
      color: "from-teal-500 to-blue-500",
      questions: [
        {
          question: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correct: 2,
          explanation: "Canberra is the capital city of Australia, located between Sydney and Melbourne.",
        },
      ],
    },
    {
      id: 6,
      title: "Code Breaker Challenge",
      subject: "Computer Science",
      grade: "9-12",
      difficulty: "Hard",
      duration: "30 min",
      players: 456,
      rating: 4.9,
      description: "Learn programming concepts through interactive coding challenges!",
      icon: "💻",
      color: "from-indigo-500 to-purple-500",
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language",
          ],
          correct: 0,
          explanation: "HTML stands for HyperText Markup Language, which is used to create web pages.",
        },
      ],
    },
  ]

  const handlePlayGame = (game: any) => {
    setSelectedGame(game)
    setGameState("playing")
    setCurrentQuestion(0)
    setScore(0)
    setUserAnswer("")
  }

  const handleAnswerSubmit = () => {
    const currentQ = selectedGame.questions[currentQuestion]
    const selectedIndex = Number.parseInt(userAnswer)

    if (selectedIndex === currentQ.correct) {
      setScore(score + 10)
    }

    if (currentQuestion < selectedGame.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer("")
    } else {
      setGameState("completed")
    }
  }

  const resetGame = () => {
    setSelectedGame(null)
    setGameState("menu")
    setCurrentQuestion(0)
    setScore(0)
    setUserAnswer("")
  }

  if (gameState === "playing" && selectedGame) {
    const currentQ = selectedGame.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / selectedGame.questions.length) * 100

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedGame.icon}</span>
                <div>
                  <CardTitle>{selectedGame.title}</CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {selectedGame.questions.length}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{score} pts</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={userAnswer === index.toString()}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-lg">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                Exit Game
              </Button>
              <Button onClick={handleAnswerSubmit} disabled={!userAnswer} className="bg-green-600 hover:bg-green-700">
                {currentQuestion < selectedGame.questions.length - 1 ? "Next Question" : "Finish Game"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "completed" && selectedGame) {
    const totalQuestions = selectedGame.questions.length
    const correctAnswers = score / 10
    const percentage = (correctAnswers / totalQuestions) * 100

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl">Game Complete!</CardTitle>
            <CardDescription>Great job on completing {selectedGame.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{percentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            {percentage >= 80 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">Achievement Unlocked: Quiz Master!</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent">
                Back to Games
              </Button>
              <Button onClick={() => handlePlayGame(selectedGame)} className="flex-1">
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Learning Games</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our collection of educational games designed to make learning fun and engaging. Each game is
          tailored to specific grade levels and subjects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${game.color}`} />
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{game.icon}</span>
                <Badge
                  variant={
                    game.difficulty === "Easy" ? "secondary" : game.difficulty === "Medium" ? "default" : "destructive"
                  }
                >
                  {game.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{game.subject}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium">{game.grade}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {game.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Players:</span>
                  <span className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {game.players.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                    {game.rating}
                  </span>
                </div>
              </div>

              <Button onClick={() => handlePlayGame(game)} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
