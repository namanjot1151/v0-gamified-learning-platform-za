"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Target, RefreshCw, Loader2 } from "lucide-react"

interface Question {
  question: string
  options: string[]
  correct: string
  explanation: string
}

interface EndlessQuizProps {
  subject: string
  difficulty: string
}

export default function EndlessQuiz({ subject, difficulty }: EndlessQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [usedQuestions, setUsedQuestions] = useState<string[]>([])

  const loadMoreQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/games/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          difficulty,
          count: 10,
          previousQuestions: usedQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to load questions")
      }

      const data = await response.json()
      const newQuestions = data.questions || []

      setQuestions((prev) => [...prev, ...newQuestions])
      setUsedQuestions((prev) => [...prev, ...newQuestions.map((q: Question) => q.question)])
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMoreQuestions()
  }, [subject, difficulty])

  // Load more questions when running low
  useEffect(() => {
    if (questions.length - currentQuestionIndex <= 3) {
      loadMoreQuestions()
    }
  }, [currentQuestionIndex, questions.length])

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct

    setShowResult(true)
    setTotalAnswered(totalAnswered + 1)

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1)
    setSelectedAnswer("")
    setShowResult(false)
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer("")
    setShowResult(false)
    setScore(0)
    setStreak(0)
    setTotalAnswered(0)
    setQuestions([])
    setUsedQuestions([])
    loadMoreQuestions()
  }

  if (questions.length === 0 && isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading endless questions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-600 mb-4">No questions available for this subject.</p>
          <Button onClick={loadMoreQuestions}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold text-yellow-600">{score}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-orange-600">{streak}</p>
            <p className="text-sm text-gray-600">Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
            <p className="text-sm text-gray-600">Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <RefreshCw className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{totalAnswered}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Badge variant="outline">{subject}</Badge>
              <Badge variant="secondary">{difficulty}</Badge>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={resetQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <Progress value={((currentQuestionIndex + 1) / Math.max(questions.length, 1)) * 100} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Question {currentQuestionIndex + 1}: {currentQuestion.question}
            </h3>
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                const letter = option.charAt(0)
                const isSelected = selectedAnswer === letter
                const isCorrect = letter === currentQuestion.correct
                const showCorrect = showResult && isCorrect
                const showIncorrect = showResult && isSelected && !isCorrect

                return (
                  <Button
                    key={index}
                    variant={
                      showCorrect ? "default" : showIncorrect ? "destructive" : isSelected ? "secondary" : "outline"
                    }
                    className={`justify-start text-left h-auto p-4 ${
                      showCorrect ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                    onClick={() => handleAnswerSelect(letter)}
                    disabled={showResult}
                  >
                    {option}
                  </Button>
                )
              })}
            </div>
          </div>

          {showResult && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.correct ? "✅ Correct!" : "❌ Incorrect"}
              </h4>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            {!showResult ? (
              <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="ml-auto">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="ml-auto">
                Next Question →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="text-center py-4">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Loading more questions...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
