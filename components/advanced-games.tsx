"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trophy, Star, Zap, Target } from "lucide-react"

export default function AdvancedGames() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "loading" | "completed">("menu")
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(60)
  const [userAnswer, setUserAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [isAnswering, setIsAnswering] = useState(false)

  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [memoryCards, setMemoryCards] = useState<any[]>([])
  const [moves, setMoves] = useState(0)

  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<any>(null)
  const [spinAngle, setSpinAngle] = useState(0)

  const [currentWordSet, setCurrentWordSet] = useState<any[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const [currentExperimentIndex, setCurrentExperimentIndex] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [currentMysteryIndex, setCurrentMysteryIndex] = useState(0)
  const [currentClueIndex, setCurrentClueIndex] = useState(0)
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0)
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)

  const advancedGames = [
    {
      id: 1,
      title: "Math Racing Challenge",
      subject: "Mathematics",
      grade: "6-12",
      difficulty: "Dynamic",
      duration: "Endless",
      players: 2847,
      rating: 4.9,
      description: "Race against time solving increasingly difficult math problems!",
      icon: "🏎️",
      color: "from-red-500 to-orange-500",
      gameType: "speed",
    },
    {
      id: 2,
      title: "Science Lab Simulator",
      subject: "Science",
      grade: "7-12",
      difficulty: "Interactive",
      duration: "Endless",
      players: 1923,
      rating: 4.8,
      description: "Conduct virtual experiments and discover scientific principles!",
      icon: "🧪",
      color: "from-green-500 to-teal-500",
      gameType: "simulation",
    },
    {
      id: 3,
      title: "Word Puzzle Adventure",
      subject: "English",
      grade: "5-10",
      difficulty: "Adaptive",
      duration: "Endless",
      players: 3456,
      rating: 4.7,
      description: "Solve word puzzles, build vocabulary, and master grammar!",
      icon: "🧩",
      color: "from-purple-500 to-pink-500",
      gameType: "puzzle",
    },
    {
      id: 4,
      title: "History Time Detective",
      subject: "History",
      grade: "8-12",
      difficulty: "Story-driven",
      duration: "Endless",
      players: 1567,
      rating: 4.9,
      description: "Solve historical mysteries and travel through time!",
      icon: "🕵️",
      color: "from-amber-500 to-orange-500",
      gameType: "adventure",
    },
    {
      id: 5,
      title: "Geography Explorer Quest",
      subject: "Geography",
      grade: "6-11",
      difficulty: "Interactive Map",
      duration: "Endless",
      players: 2134,
      rating: 4.8,
      description: "Explore the world through interactive maps and challenges!",
      icon: "🗺️",
      color: "from-blue-500 to-cyan-500",
      gameType: "exploration",
    },
    {
      id: 6,
      title: "Code Quest Challenge",
      subject: "Computer Science",
      grade: "9-12",
      difficulty: "Progressive",
      duration: "Endless",
      players: 987,
      rating: 4.9,
      description: "Learn programming through interactive coding challenges!",
      icon: "💻",
      color: "from-indigo-500 to-purple-500",
      gameType: "coding",
    },
  ]

  const generateNextQuestion = async () => {
    if (!selectedGame) return

    setGameState("loading")
    try {
      const response = await fetch("/app/api/games/endless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_questions",
          gameType: selectedGame.gameType,
          subject: selectedGame.subject,
          level: currentLevel,
          usedQuestionIds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      if (data.questions && data.questions.length > 0) {
        setCurrentQuestion(data.questions[0])
        setUsedQuestionIds((prev) => [
          ...prev,
          data.questions[0].question?.substring(0, 50) || Math.random().toString(),
        ])
        setTimeLeft(Math.max(30, 60 - currentLevel * 2)) // Decrease time as level increases
        setGameState("playing")
      } else {
        throw new Error("No questions received")
      }
    } catch (error) {
      console.error("Failed to generate question:", error)

      const fallbackQuestions = {
        simulation: {
          question: `Level ${currentLevel} Science Experiment: What happens when you heat water to 100°C?`,
          answer: "It boils",
          options: ["It freezes", "It boils", "It evaporates slowly", "Nothing happens"],
          explanation: "Water boils at 100°C at sea level pressure.",
        },
        puzzle: {
          question: `Level ${currentLevel} Word Puzzle: Unscramble "NOITACUDE"`,
          answer: "EDUCATION",
          options: ["EDUCATION", "DEDICATION", "CREATION", "FOUNDATION"],
          explanation: "The word is EDUCATION - the process of learning.",
        },
        adventure: {
          question: `Level ${currentLevel} History Mystery: Who built the pyramids of Giza?`,
          answer: "Ancient Egyptians",
          options: ["Ancient Greeks", "Ancient Egyptians", "Romans", "Babylonians"],
          explanation: "The pyramids were built by ancient Egyptians as tombs for pharaohs.",
        },
        exploration: {
          question: `Level ${currentLevel} Geography Quest: What is the largest continent?`,
          answer: "Asia",
          options: ["Africa", "Asia", "North America", "Europe"],
          explanation: "Asia is the largest continent by both area and population.",
        },
        coding: {
          question: `Level ${currentLevel} Code Challenge: What does 'print()' do in Python?`,
          answer: "Displays output",
          options: ["Saves file", "Displays output", "Creates variable", "Deletes data"],
          explanation: "The print() function displays output to the console.",
        },
      }

      const fallback =
        fallbackQuestions[selectedGame.gameType as keyof typeof fallbackQuestions] || fallbackQuestions.simulation

      setCurrentQuestion({
        ...fallback,
        difficulty: currentLevel,
      })
      setGameState("playing")

      // Show user-friendly error message
      setTimeout(() => {
        console.log("[v0] Using offline questions due to server load")
      }, 100)
    }
  }

  const handleAnswerSubmit = async (selectedAnswer: string) => {
    if (!currentQuestion || isAnswering) return

    setIsAnswering(true)
    const timeSpent = Math.max(30, 60 - currentLevel * 2) - timeLeft

    try {
      const response = await fetch("/api/games/endless", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate_answer",
          userAnswer: selectedAnswer,
          correctAnswer: currentQuestion.answer,
          timeSpent,
          level: currentLevel,
        }),
      })

      const data = await response.json()

      if (data.isCorrect) {
        setScore(score + data.points)
        setStreak(streak + 1)
        setCurrentLevel(currentLevel + 1)

        // Generate next question after short delay
        setTimeout(() => {
          generateNextQuestion()
          setIsAnswering(false)
        }, 1500)
      } else {
        setStreak(0)
        setLives(lives - 1)
        setIsAnswering(false)

        if (lives <= 1) {
          setGameState("completed")
        } else {
          // Generate new question on wrong answer
          setTimeout(() => {
            generateNextQuestion()
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Failed to validate answer:", error)
      setIsAnswering(false)
      // Fallback validation
      const isCorrect = selectedAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()
      if (isCorrect) {
        setScore(score + (10 + currentLevel * 5))
        setStreak(streak + 1)
        setCurrentLevel(currentLevel + 1)
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
      }
      setTimeout(() => {
        generateNextQuestion()
      }, 1500)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (gameState === "playing" && timeLeft === 0) {
      // Time up - treat as wrong answer
      setLives(lives - 1)
      setStreak(0)
      if (lives <= 1) {
        setGameState("completed")
      } else {
        generateNextQuestion()
      }
    }
    return () => clearTimeout(timer)
  }, [gameState, timeLeft, lives])

  // Timer effect for speed games
  // useEffect(() => {
  //   let timer: NodeJS.Timeout
  //   if (gameState === "playing" && timeLeft > 0 && selectedGame?.gameType === "speed") {
  //     timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
  //   } else if (timeLeft === 0 && gameState === "playing" && selectedGame?.gameType === "speed") {
  //     handleTimeUp()
  //   }
  //   return () => clearTimeout(timer)
  // }, [timeLeft, gameState])

  const initializeMemoryGame = async (subject: string, difficulty: string) => {
    setGameState("loading")
    try {
      const response = await fetch("/api/games/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_cards",
          gameData: { subject, difficulty, cardCount: 8 },
        }),
      })
      const data = await response.json()
      const shuffledCards = [...data.cards].sort(() => Math.random() - 0.5)
      setMemoryCards(shuffledCards)
      setFlippedCards([])
      setMatchedCards([])
      setMoves(0)
      setGameState("playing")
    } catch (error) {
      console.error("Failed to initialize memory game:", error)
      // Fallback to static cards
      const fallbackCards = [
        { id: 1, content: "H₂O", match: "Water" },
        { id: 2, content: "Water", match: "H₂O" },
        { id: 3, content: "CO₂", match: "Carbon Dioxide" },
        { id: 4, content: "Carbon Dioxide", match: "CO₂" },
      ]
      setMemoryCards(fallbackCards)
      setGameState("playing")
    }
  }

  const initializeWordGame = async (subject: string, difficulty: string) => {
    setGameState("loading")
    try {
      const response = await fetch("/api/games/word-scramble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_words",
          gameData: { subject, difficulty, wordCount: 5 },
        }),
      })
      const data = await response.json()
      setCurrentWordSet(data.words)
      setCurrentWordIndex(0)
      setGameState("playing")
    } catch (error) {
      console.error("Failed to initialize word game:", error)
      // Fallback words
      const fallbackWords = [
        { word: "EDUCATION", scrambled: "NOITACUDE", hint: "Learning process" },
        { word: "KNOWLEDGE", scrambled: "EGDELWONK", hint: "Information and skills" },
      ]
      setCurrentWordSet(fallbackWords)
      setCurrentWordIndex(0)
      setGameState("playing")
    }
  }

  const initializeSpeedMath = async (level: number, difficulty: string) => {
    setGameState("loading")
    try {
      const response = await fetch("/api/games/speed-math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_problems",
          gameData: { level, difficulty, problemCount: 1 },
        }),
      })
      const data = await response.json()
      setCurrentQuestion(data.problems[0])
      setTimeLeft(data.problems[0].timeLimit || 30)
      setGameState("playing")
    } catch (error) {
      console.error("Failed to initialize speed math:", error)
      // Fallback question
      setCurrentQuestion({ question: "15 + 27 = ?", answer: "42", timeLimit: 30 })
      setTimeLeft(30)
      setGameState("playing")
    }
  }

  const handleCardFlip = async (cardIndex: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedCards.includes(cardIndex)) {
      return
    }

    const newFlippedCards = [...flippedCards, cardIndex]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstIndex, secondIndex] = newFlippedCards
      const firstCard = memoryCards[firstIndex]
      const secondCard = memoryCards[secondIndex]

      if (firstCard.content === secondCard.match || firstCard.match === secondCard.content) {
        // Match found
        setTimeout(() => {
          setMatchedCards([...matchedCards, firstIndex, secondIndex])
          setFlippedCards([])
          setScore(score + 10)
          setStreak(streak + 1)
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
          setStreak(0)
        }, 1000)
      }
    }
  }

  const handleSpinWheelAnswer = async (selectedAnswer: string, question: any, isBonus: boolean) => {
    try {
      const response = await fetch("/api/games/spin-wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate_answer",
          gameData: { userAnswer: selectedAnswer, correctAnswer: question.answer, isBonus },
        }),
      })
      const data = await response.json()

      if (data.isCorrect) {
        setScore(score + data.points)
        setStreak(streak + 1)
      } else {
        setStreak(0)
      }
      setSpinResult(null)
    } catch (error) {
      console.error("Failed to validate spin wheel answer:", error)
      // Fallback validation
      if (selectedAnswer === question.answer) {
        setScore(score + (isBonus ? 20 : 10))
        setStreak(streak + 1)
      } else {
        setStreak(0)
      }
      setSpinResult(null)
    }
  }

  const handleWordSubmit = async () => {
    if (!currentWordSet[currentWordIndex] || !userAnswer.trim()) return

    try {
      const response = await fetch("/api/games/word-scramble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check_answer",
          gameData: {
            userAnswer: userAnswer.trim(),
            correctWord: currentWordSet[currentWordIndex].word,
          },
        }),
      })
      const data = await response.json()

      if (data.isCorrect) {
        setScore(score + data.points)
        setStreak(streak + 1)

        if (currentWordIndex < currentWordSet.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1)
          setUserAnswer("")
          setShowHint(false)
        } else {
          setGameState("completed")
        }
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
      }
    } catch (error) {
      console.error("Failed to check word answer:", error)
      // Fallback validation
      if (userAnswer.toLowerCase().trim() === currentWordSet[currentWordIndex].word.toLowerCase()) {
        setScore(score + 15)
        setStreak(streak + 1)
        if (currentWordIndex < currentWordSet.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1)
          setUserAnswer("")
          setShowHint(false)
        } else {
          setGameState("completed")
        }
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
      }
    }
  }

  const handleMathSubmit = async () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const timeSpent = currentQuestion.timeLimit - timeLeft

    try {
      const response = await fetch("/api/games/speed-math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check_answer",
          gameData: {
            userAnswer: userAnswer.trim(),
            correctAnswer: currentQuestion.answer,
            timeSpent,
            timeLimit: currentQuestion.timeLimit,
          },
        }),
      })
      const data = await response.json()

      if (data.isCorrect) {
        setScore(score + data.points)
        setStreak(streak + 1)

        // Generate next problem
        await initializeSpeedMath(currentLevel + 1, selectedGame.difficulty)
        setCurrentLevel(currentLevel + 1)
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
      }
      setUserAnswer("")
    } catch (error) {
      console.error("Failed to check math answer:", error)
      // Fallback validation
      if (Number.parseFloat(userAnswer) === Number.parseFloat(currentQuestion.answer)) {
        setScore(score + 10 + Math.floor(timeLeft / 2))
        setStreak(streak + 1)
        setCurrentLevel(currentLevel + 1)
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
      }
      setUserAnswer("")
    }
  }

  const getWordHint = async () => {
    if (!currentWordSet[currentWordIndex]) return

    try {
      const response = await fetch("/api/games/word-scramble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_hint",
          gameData: {
            word: currentWordSet[currentWordIndex].word,
            currentHint: currentWordSet[currentWordIndex].hint,
          },
        }),
      })
      const data = await response.json()
      setCurrentWordSet((prev) =>
        prev.map((word, index) => (index === currentWordIndex ? { ...word, hint: data.hint } : word)),
      )
      setShowHint(true)
    } catch (error) {
      console.error("Failed to get hint:", error)
      setShowHint(true)
    }
  }

  const handlePlayGame = async (game: any) => {
    setSelectedGame(game)
    setCurrentLevel(1)
    setScore(0)
    setStreak(0)
    setLives(3)
    setUserAnswer("")
    setGameStartTime(new Date())
    setUsedQuestionIds([])
    setCurrentQuestion(null)
    setIsAnswering(false)

    // Start with first question
    await generateNextQuestion()
  }

  const handleSpin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    const randomAngle = Math.random() * 360 + 1440
    setSpinAngle(spinAngle + randomAngle)

    try {
      const response = await fetch("/api/games/spin-wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_questions",
          gameData: {
            subjects: ["Math", "Science", "English", "History", "Geography"],
            difficulty: selectedGame.difficulty,
          },
        }),
      })
      const data = await response.json()

      setTimeout(() => {
        const randomQuestion = data.questions[Math.floor(Math.random() * data.questions.length)]
        setSpinResult({
          section: { subject: randomQuestion.subject },
          question: randomQuestion,
        })
        setIsSpinning(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to generate spin questions:", error)
      // Fallback question
      setTimeout(() => {
        setSpinResult({
          section: { subject: "Math" },
          question: { question: "What is 12 × 8?", answer: "96", options: ["94", "96", "98", "100"] },
        })
        setIsSpinning(false)
      }, 3000)
    }
  }

  const handleTimeUp = () => {
    setLives(lives - 1)
    if (lives <= 1) {
      setGameState("completed")
    } else {
      setTimeLeft(currentQuestion?.timeLimit || 30)
      setUserAnswer("")
    }
  }

  const resetGame = () => {
    setSelectedGame(null)
    setGameState("menu")
    setScore(0)
    setStreak(0)
    setLives(3)
    setTimeLeft(60)
    setCurrentLevel(1)
    setUserAnswer("")
    setShowHint(false)
    setUsedQuestionIds([])
    setCurrentQuestion(null)
    setIsAnswering(false)
    setCurrentWordIndex(0)
    setCurrentWordSet([])
    setMemoryCards([])
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setSpinAngle(0)
    setIsSpinning(false)
    setSpinResult(null)
    setCurrentExperimentIndex(0)
    setCurrentStepIndex(0)
    setCurrentPuzzleIndex(0)
    setCurrentMysteryIndex(0)
    setCurrentClueIndex(0)
    setCurrentRegionIndex(0)
    setCurrentChallengeIndex(0)
  }

  if (gameState === "loading") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="text-center p-8">
          <CardContent>
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Generating Level {currentLevel} Question...</h3>
            <p className="text-gray-600">Creating personalized content for endless learning!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedGame.icon}</span>
                <div>
                  <CardTitle className="text-lg sm:text-xl">{selectedGame.title}</CardTitle>
                  <CardDescription>Level {currentLevel} • Endless Mode</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{streak}</div>
                  <div className="text-xs text-gray-500">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">{lives}</div>
                  <div className="text-xs text-gray-500">Lives</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">{timeLeft}</div>
                  <div className="text-xs text-gray-500">Time</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={(timeLeft / Math.max(30, 60 - currentLevel * 2)) * 100} className="h-2" />
            </div>

            <div className={`bg-gradient-to-r ${selectedGame.color} rounded-lg p-6 sm:p-8 mb-6 text-white`}>
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  Level {currentLevel}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{currentQuestion.question}</h3>
                {currentQuestion.explanation && <p className="text-sm opacity-90">{currentQuestion.explanation}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options?.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="h-auto p-4 text-left bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={() => handleAnswerSubmit(option)}
                    disabled={isAnswering}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span className="ml-2">{option}</span>
                  </Button>
                ))}
              </div>

              {isAnswering && (
                <div className="text-center mt-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-white" />
                  <p className="text-sm mt-2">Checking answer...</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>Level {currentLevel}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>{streak} Streak</span>
                </Badge>
              </div>
              <Button variant="outline" onClick={resetGame}>
                End Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame?.gameType === "simulation") {
    const currentExperiment = selectedGame.experiments?.[currentExperimentIndex] || selectedGame.experiments?.[0]
    const currentStep = currentExperiment?.steps?.[currentStepIndex] || currentExperiment?.steps?.[0]
    const progress = currentExperiment ? ((currentStepIndex + 1) / currentExperiment.steps.length) * 100 : 0

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
                    {currentExperiment?.name} - Step {currentStepIndex + 1} of {currentExperiment?.steps.length}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{streak}</div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-8 mb-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentExperiment?.name}</h3>
                <p className="text-gray-600 mb-4">{currentExperiment?.description}</p>
              </div>

              {currentStep && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-xl font-semibold mb-4 text-center">{currentStep.step}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentStep.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 text-left bg-transparent hover:bg-green-50"
                        onClick={() => {
                          const isCorrect = option.toLowerCase() === currentStep.answer.toLowerCase()
                          if (isCorrect) {
                            setScore(score + 10)
                            setStreak(streak + 1)
                            if (currentStepIndex < currentExperiment.steps.length - 1) {
                              setCurrentStepIndex(currentStepIndex + 1)
                            } else if (currentExperimentIndex < selectedGame.experiments.length - 1) {
                              setCurrentExperimentIndex(currentExperimentIndex + 1)
                              setCurrentStepIndex(0)
                            } else {
                              setGameState("completed")
                            }
                          } else {
                            setStreak(0)
                            setLives(Math.max(0, lives - 1))
                            if (lives <= 1) {
                              setGameState("completed")
                            }
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                Exit Lab
              </Button>
              <Button
                onClick={() => {
                  if (currentStepIndex < currentExperiment.steps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1)
                  }
                }}
                variant="secondary"
                disabled={currentStepIndex >= currentExperiment.steps.length - 1}
              >
                Skip Step
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame?.gameType === "puzzle") {
    const currentPuzzle = selectedGame.puzzles?.[currentPuzzleIndex] || selectedGame.puzzles?.[0]
    const progress = selectedGame.puzzles ? ((currentPuzzleIndex + 1) / selectedGame.puzzles.length) * 100 : 0

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
                    Puzzle {currentPuzzleIndex + 1} of {selectedGame.puzzles?.length}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{streak}</div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 mb-6">
              {currentPuzzle?.type === "anagram" && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Unscramble this word:</h3>
                  <div className="text-4xl font-bold mb-4 text-purple-600 tracking-wider">
                    {currentPuzzle.scrambled}
                  </div>
                  <p className="text-gray-600 mb-6">Hint: {currentPuzzle.clue}</p>
                  <Input
                    type="text"
                    placeholder="Enter the unscrambled word..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const isCorrect = userAnswer.toLowerCase() === currentPuzzle.word.toLowerCase()
                        if (isCorrect) {
                          setScore(score + 15)
                          setStreak(streak + 1)
                          setUserAnswer("")
                          if (currentPuzzleIndex < selectedGame.puzzles.length - 1) {
                            setCurrentPuzzleIndex(currentPuzzleIndex + 1)
                          } else {
                            setGameState("completed")
                          }
                        } else {
                          setStreak(0)
                          setLives(Math.max(0, lives - 1))
                          if (lives <= 1) setGameState("completed")
                        }
                      }
                    }}
                    className="text-center text-xl py-3 max-w-md mx-auto"
                    autoFocus
                  />
                </div>
              )}

              {(currentPuzzle?.type === "synonym" || currentPuzzle?.type === "grammar") && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {currentPuzzle.type === "synonym"
                      ? `Find the synonym for: ${currentPuzzle.word}`
                      : "Complete the sentence:"}
                  </h3>
                  {currentPuzzle.sentence && <div className="text-xl mb-6 text-gray-700">{currentPuzzle.sentence}</div>}
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {currentPuzzle.options?.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 text-left bg-transparent hover:bg-purple-50"
                        onClick={() => {
                          const isCorrect = option === currentPuzzle.correct
                          if (isCorrect) {
                            setScore(score + 10)
                            setStreak(streak + 1)
                            if (currentPuzzleIndex < selectedGame.puzzles.length - 1) {
                              setCurrentPuzzleIndex(currentPuzzleIndex + 1)
                            } else {
                              setGameState("completed")
                            }
                          } else {
                            setStreak(0)
                            setLives(Math.max(0, lives - 1))
                            if (lives <= 1) setGameState("completed")
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                Exit Adventure
              </Button>
              <Button
                onClick={() => {
                  if (currentPuzzleIndex < selectedGame.puzzles.length - 1) {
                    setCurrentPuzzleIndex(currentPuzzleIndex + 1)
                  }
                }}
                variant="secondary"
                disabled={currentPuzzleIndex >= selectedGame.puzzles.length - 1}
              >
                Skip Puzzle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame?.gameType === "adventure") {
    const currentMystery = selectedGame.mysteries?.[currentMysteryIndex] || selectedGame.mysteries?.[0]
    const currentClue = currentMystery?.clues?.[currentClueIndex] || currentMystery?.clues?.[0]
    const progress = currentMystery ? ((currentClueIndex + 1) / currentMystery.clues.length) * 100 : 0

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
                    {currentMystery?.era} - Clue {currentClueIndex + 1} of {currentMystery?.clues.length}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 mb-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentMystery?.mystery}</h3>
                <p className="text-lg text-amber-700 mb-4">Era: {currentMystery?.era}</p>
              </div>

              {currentClue && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-xl font-semibold mb-4 text-center">{currentClue.clue}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentClue.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 text-left bg-transparent hover:bg-amber-50"
                        onClick={() => {
                          const isCorrect = option.toLowerCase() === currentClue.answer.toLowerCase()
                          if (isCorrect) {
                            setScore(score + 20)
                            setStreak(streak + 1)
                            if (currentClueIndex < currentMystery.clues.length - 1) {
                              setCurrentClueIndex(currentClueIndex + 1)
                            } else if (currentMysteryIndex < selectedGame.mysteries.length - 1) {
                              setCurrentMysteryIndex(currentMysteryIndex + 1)
                              setCurrentClueIndex(0)
                            } else {
                              setGameState("completed")
                            }
                          } else {
                            setStreak(0)
                            setLives(Math.max(0, lives - 1))
                            if (lives <= 1) setGameState("completed")
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                Exit Investigation
              </Button>
              <Button
                onClick={() => {
                  if (currentClueIndex < currentMystery.clues.length - 1) {
                    setCurrentClueIndex(currentClueIndex + 1)
                  }
                }}
                variant="secondary"
                disabled={currentClueIndex >= currentMystery.clues.length - 1}
              >
                Skip Clue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame?.gameType === "exploration") {
    const currentRegion = selectedGame.regions?.[currentRegionIndex] || selectedGame.regions?.[0]
    const currentChallenge = currentRegion?.challenges?.[currentChallengeIndex] || currentRegion?.challenges?.[0]
    const progress = currentRegion ? ((currentChallengeIndex + 1) / currentRegion.challenges.length) * 100 : 0

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
                    {currentRegion?.name} - Challenge {currentChallengeIndex + 1} of {currentRegion?.challenges.length}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">{streak}</div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-8 mb-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Exploring: {currentRegion?.name}</h3>
              </div>

              {currentChallenge && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-xl font-semibold mb-4 text-center">
                    What is the capital of {currentChallenge.country}?
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {currentChallenge.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 text-left bg-transparent hover:bg-blue-50"
                        onClick={() => {
                          const isCorrect = option === currentChallenge.capital
                          if (isCorrect) {
                            setScore(score + 15)
                            setStreak(streak + 1)
                            if (currentChallengeIndex < currentRegion.challenges.length - 1) {
                              setCurrentChallengeIndex(currentChallengeIndex + 1)
                            } else if (currentRegionIndex < selectedGame.regions.length - 1) {
                              setCurrentRegionIndex(currentRegionIndex + 1)
                              setCurrentChallengeIndex(0)
                            } else {
                              setGameState("completed")
                            }
                          } else {
                            setStreak(0)
                            setLives(Math.max(0, lives - 1))
                            if (lives <= 1) setGameState("completed")
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                Exit Quest
              </Button>
              <Button
                onClick={() => {
                  if (currentChallengeIndex < currentRegion.challenges.length - 1) {
                    setCurrentChallengeIndex(currentChallengeIndex + 1)
                  }
                }}
                variant="secondary"
                disabled={currentChallengeIndex >= currentRegion.challenges.length - 1}
              >
                Skip Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame?.gameType === "coding") {
    const currentChallenge = selectedGame.challenges?.[currentChallengeIndex] || selectedGame.challenges?.[0]
    const progress = selectedGame.challenges ? ((currentChallengeIndex + 1) / selectedGame.challenges.length) * 100 : 0

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
                    {currentChallenge?.level} - Challenge {currentChallengeIndex + 1} of{" "}
                    {selectedGame.challenges?.length}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{streak}</div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 mb-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentChallenge?.task}</h3>
                <p className="text-lg text-indigo-700 mb-4">Level: {currentChallenge?.level}</p>
              </div>

              {currentChallenge && (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                    <pre>{currentChallenge.code}</pre>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="text-xl font-semibold mb-4 text-center">{currentChallenge.question}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {currentChallenge.options?.map((option: string, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-4 text-left bg-transparent hover:bg-indigo-50"
                          onClick={() => {
                            const isCorrect = option.toLowerCase() === currentChallenge.answer.toLowerCase()
                            if (isCorrect) {
                              setScore(score + 25)
                              setStreak(streak + 1)
                              if (currentChallengeIndex < selectedGame.challenges.length - 1) {
                                setCurrentChallengeIndex(currentChallengeIndex + 1)
                              } else {
                                setGameState("completed")
                              }
                            } else {
                              setStreak(0)
                              setLives(Math.max(0, lives - 1))
                              if (lives <= 1) setGameState("completed")
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                Exit Challenge
              </Button>
              <Button
                onClick={() => {
                  if (currentChallengeIndex < selectedGame.challenges.length - 1) {
                    setCurrentChallengeIndex(currentChallengeIndex + 1)
                  }
                }}
                variant="secondary"
                disabled={currentChallengeIndex >= selectedGame.challenges.length - 1}
              >
                Skip Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "completed") {
    const finalTime = gameStartTime ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000) : 0
    const minutes = Math.floor(finalTime / 60)
    const seconds = finalTime % 60

    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="text-center p-8">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Game Complete!</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentLevel}</div>
                <div className="text-sm text-gray-600">Level Reached</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{streak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Time Played</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => handlePlayGame(selectedGame)} className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Play Again</span>
              </Button>
              <Button variant="outline" onClick={resetGame}>
                Choose New Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Learning Games
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Challenge yourself with endless educational games that adapt to your level and never repeat questions!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advancedGames.map((game) => (
          <Card key={game.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{game.icon}</span>
                <Badge variant="secondary" className="text-xs">
                  {game.duration}
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{game.title}</CardTitle>
              <CardDescription className="text-sm">{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{game.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium">{game.grade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium">{game.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Players:</span>
                  <span className="font-medium">{game.players.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{game.rating}</span>
                  </div>
                </div>
              </div>
              <Button
                className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 transition-opacity`}
                onClick={() => handlePlayGame(game)}
              >
                Start Endless Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
