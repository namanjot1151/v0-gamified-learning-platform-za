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
    {
      id: 7,
      title: "Memory Match Challenge",
      subject: "Science",
      grade: "6-10",
      difficulty: "Interactive",
      duration: "Endless",
      players: 1500,
      rating: 4.7,
      description: "Match science terms with their definitions!",
      icon: "🧠",
      color: "from-teal-500 to-emerald-500",
      gameType: "memory",
    },
    {
      id: 8,
      title: "Spin Wheel Challenge",
      subject: "Mixed",
      grade: "6-12",
      difficulty: "Random",
      duration: "Endless",
      players: 1200,
      rating: 4.8,
      description: "Spin the wheel for random questions across subjects!",
      icon: "🎡",
      color: "from-gray-500 to-gray-700",
      gameType: "spin",
    },
  ]

  const generateNextQuestion = async () => {
    if (!selectedGame) return

    setGameState("loading")
    try {
      const response = await fetch("/api/games/endless", {
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
        setTimeLeft(Math.max(30, 60 - currentLevel * 2))
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
        speed: {
          question: `Level ${currentLevel} Math Challenge: What is 15 + 27?`,
          answer: "42",
          options: ["39", "42", "45", "48"],
          explanation: "15 + 27 = 42.",
        },
      }

      const fallback =
        fallbackQuestions[selectedGame.gameType as keyof typeof fallbackQuestions] || fallbackQuestions.simulation

      setCurrentQuestion({
        ...fallback,
        difficulty: currentLevel,
      })
      setGameState("playing")

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
          setTimeout(() => {
            generateNextQuestion()
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Failed to validate answer:", error)
      setIsAnswering(false)
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
      handleTimeUp()
    }
    return () => clearTimeout(timer)
  }, [gameState, timeLeft, lives])

  const initializeMemoryGame = async (subject: string = "Science", difficulty: string = "Medium") => {
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

  const handleCardFlip = (cardIndex: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedCards.includes(cardIndex)) return

    const newFlippedCards = [...flippedCards, cardIndex]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstIndex, secondIndex] = newFlippedCards
      const firstCard = memoryCards[firstIndex]
      const secondCard = memoryCards[secondIndex]

      if (firstCard.content === secondCard.match || firstCard.match === secondCard.content) {
        setTimeout(() => {
          setMatchedCards([...matchedCards, firstIndex, secondIndex])
          setFlippedCards([])
          setScore(score + 10)
          setStreak(streak + 1)
          if (matchedCards.length + 2 === memoryCards.length) setGameState("completed")
        }, 1000)
      } else {
        setTimeout(() => {
          setFlippedCards([])
          setStreak(0)
          setLives(lives - 1)
          if (lives <= 1) setGameState("completed")
        }, 1000)
      }
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
      setCurrentQuestion({ question: "15 + 27 = ?", answer: "42", timeLimit: 30 })
      setTimeLeft(30)
      setGameState("playing")
    }
  }

  const handleSpinWheelAnswer = async (selectedAnswer: string, question: any, isBonus: boolean) => {
    if (isAnswering) return

    setIsAnswering(true)
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
        setScore(score + (isBonus ? 20 : 10))
        setStreak(streak + 1)
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
      }
      setSpinResult(null)
      setIsAnswering(false)
    } catch (error) {
      console.error("Failed to validate spin wheel answer:", error)
      setIsAnswering(false)
      const isCorrect = selectedAnswer.toLowerCase() === question.answer.toLowerCase()
      if (isCorrect) {
        setScore(score + (isBonus ? 20 : 10))
        setStreak(streak + 1)
      } else {
        setStreak(0)
        setLives(lives - 1)
        if (lives <= 1) {
          setGameState("completed")
        }
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
      if (Number.parseFloat(userAnswer) === Number.parseFloat(currentQuestion.answer)) {
        setScore(score + 10 + Math.floor(timeSpent / 2))
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

  const handleSpin = async () => {
    if (isSpinning || !selectedGame) return

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
    setStreak(0)
    if (lives <= 1) {
      setGameState("completed")
    } else if (selectedGame?.gameType === "speed") {
      setTimeout(() => {
        initializeSpeedMath(currentLevel, selectedGame.difficulty)
      }, 1500)
    } else if (selectedGame?.gameType === "spin") {
      setTimeout(() => {
        handleSpin()
      }, 1500)
    } else {
      setTimeout(() => {
        generateNextQuestion()
      }, 1500)
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

    if (game.gameType === "memory") {
      await initializeMemoryGame(game.subject, game.difficulty)
    } else if (game.gameType === "puzzle") {
      await initializeWordGame(game.subject, game.difficulty)
    } else if (game.gameType === "speed") {
      await initializeSpeedMath(1, game.difficulty)
    } else if (game.gameType === "spin") {
      await handleSpin()
    } else {
      await generateNextQuestion()
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
            <h3 className="text-xl font-semibold mb-2">Generating Level {currentLevel} Challenge...</h3>
            <p className="text-gray-600">Creating personalized content for endless learning!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && currentQuestion && !spinResult) {
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

  if (gameState === "playing" && selectedGame?.gameType === "speed" && currentQuestion) {
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

              <Input
                type="text"
                placeholder="Enter your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleMathSubmit()
                }}
                className="w-full mb-4 p-2 text-black"
              />
              <Button onClick={handleMathSubmit} disabled={isAnswering} className="w-full">
                Submit
              </Button>

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
                Skip               Step
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
                  <p className="text-gray-600 mb-6">Hint: {showHint ? currentPuzzle.hint : "Click 'Hint' to reveal"}</p>
                  <Input
                    type="text"
                    placeholder="Enter the unscrambled word..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleWordSubmit()
                    }}
                    className="w-full mb-4 p-2 text-black"
                  />
                  <Button onClick={handleWordSubmit} className="w-full mb-2">
                    Submit
                  </Button>
                  <Button variant="outline" onClick={getWordHint} className="w-full">
                    Hint
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>Puzzle {currentPuzzleIndex + 1}</span>
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

  if (gameState === "playing" && selectedGame?.gameType === "memory") {
    const progress = memoryCards.length > 0 ? (matchedCards.length / memoryCards.length) * 100 : 0

    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedGame.icon}</span>
                <div>
                  <CardTitle className="text-lg sm:text-xl">{selectedGame.title}</CardTitle>
                  <CardDescription>Match {memoryCards.length / 2} Pairs</CardDescription>
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
                  <div className="text-xl sm:text-2xl font-bold text-teal-600">{moves}</div>
                  <div className="text-xs text-gray-500">Moves</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <div className={`bg-gradient-to-r ${selectedGame.color} rounded-lg p-6 sm:p-8 mb-6 text-white`}>
              <div className="grid grid-cols-4 gap-4">
                {memoryCards.map((card, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className={`h-24 w-full flex items-center justify-center text-lg font-bold ${
                      flippedCards.includes(index) || matchedCards.includes(index)
                        ? "bg-white/30"
                        : "bg-white/10 hover:bg-white/20"
                    } ${matchedCards.includes(index) ? "opacity-50" : ""}`}
                    onClick={() => handleCardFlip(index)}
                    disabled={flippedCards.length === 2 || matchedCards.length === memoryCards.length}
                  >
                    {(flippedCards.includes(index) || matchedCards.includes(index)) ? card.content : "❓"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>{matchedCards.length / 2} / {memoryCards.length / 2} Pairs</span>
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
                    {currentMystery?.title} - Clue {currentClueIndex + 1} of {currentMystery?.clues.length}
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
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentMystery?.title}</h3>
                <p className="text-gray-600 mb-4">{currentClue?.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentClue?.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left bg-transparent hover:bg-amber-50"
                    onClick={() => {
                      const isCorrect = option.toLowerCase() === currentClue.answer.toLowerCase()
                      if (isCorrect) {
                        setScore(score + 10)
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

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                End Mission
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
                Next Clue
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
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentChallenge?.title}</h3>
                <p className="text-gray-600 mb-4">{currentChallenge?.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentChallenge?.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left bg-transparent hover:bg-blue-50"
                    onClick={() => {
                      const isCorrect = option.toLowerCase() === currentChallenge.answer.toLowerCase()
                      if (isCorrect) {
                        setScore(score + 10)
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

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                End Exploration
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
                Next Challenge
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
                    Challenge {currentChallengeIndex + 1} of {selectedGame.challenges?.length}
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
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{currentChallenge?.title}</h3>
                <p className="text-gray-600 mb-4">{currentChallenge?.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentChallenge?.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left bg-transparent hover:bg-indigo-50"
                    onClick={() => {
                      const isCorrect = option.toLowerCase() === currentChallenge.answer.toLowerCase()
                      if (isCorrect) {
                        setScore(score + 10)
                        setStreak(streak + 1)
                        if (currentChallengeIndex < selectedGame.challenges.length - 1) {
                          setCurrentChallengeIndex(currentChallengeIndex + 1)
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

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetGame}>
                End Challenge
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
                Next Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame?.gameType === "spin" && spinResult) {
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={50} className="h-2" /> {/* Static progress for demo */}
            </div>

            <div className={`bg-gradient-to-r ${selectedGame.color} rounded-lg p-6 sm:p-8 mb-6 text-white`}>
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  {spinResult.section.subject}
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">{spinResult.question.question}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {spinResult.question.options?.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="h-auto p-4 text-left bg-white/20 hover:bg-white/30 text-white border-white/30"
                    onClick={() => handleSpinWheelAnswer(option, spinResult.question, false)}
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
              <Button variant="outline" onClick={() => setSpinResult(null)}>
                Back to Spin
              </Button>
              <Button variant="outline" onClick={handleSpin} disabled={isSpinning}>
                Spin Again {isSpinning && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "completed") {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="text-center p-8">
          <CardContent>
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Game Completed!</h3>
            <p className="text-lg mb-4">Final Score: {score}</p>
            <p className="text-md text-gray-600">Great job! You've mastered {selectedGame?.title}.</p>
            <Button className="mt-4" onClick={resetGame}>
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Advanced Learning Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {advancedGames.map((game) => (
          <Card
            key={game.id}
            className={`bg-gradient-to-br ${game.color} text-white cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => handlePlayGame(game)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{game.icon}</span>
                <CardTitle className="text-lg">{game.title}</CardTitle>
              </div>
              <CardDescription className="text-white/80">{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span>Players: {game.players}</span>
                <span>Rating: {game.rating}⭐</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
