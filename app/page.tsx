"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Trophy, Star, Play, Users, Target, Menu, X } from "lucide-react"
import AuthModal from "@/components/auth-modal"
import GameCard from "@/components/game-card"
import VideoSuggestions from "@/components/video-suggestions"
import Dashboard from "@/components/dashboard"
import AIChatbot from "@/components/ai-chatbot"
import AdvancedGames from "@/components/advanced-games"
import EndlessQuiz from "@/components/endless-quiz"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [currentView, setCurrentView] = useState<
    "home" | "games" | "videos" | "dashboard" | "advanced-games" | "endless-quiz" | "chat"
  >("home")
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quizSubject, setQuizSubject] = useState("Math")
  const [quizDifficulty, setQuizDifficulty] = useState("easy")

  const subjects = [
    { name: "Mathematics", icon: "🔢", progress: 75, level: 8 },
    { name: "Science", icon: "🔬", progress: 60, level: 6 },
    { name: "English", icon: "📚", progress: 85, level: 9 },
    { name: "History", icon: "🏛️", progress: 45, level: 4 },
    { name: "Geography", icon: "🌍", progress: 70, level: 7 },
    { name: "Physics", icon: "⚛️", progress: 55, level: 5 },
    { name: "Chemistry", icon: "🧪", progress: 65, level: 6 },
    { name: "Biology", icon: "🧬", progress: 80, level: 8 },
  ]

  const achievements = [
    { title: "Math Wizard", description: "Completed 50 math problems", icon: "🧙‍♂️" },
    { title: "Science Explorer", description: "Finished 3 science experiments", icon: "🔬" },
    { title: "Reading Champion", description: "Read 10 stories", icon: "📖" },
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center mb-8 md:mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 text-balance">
              Learn Through Play
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-pretty px-4">
              Transform your education with our gamified learning platform designed specifically for rural students.
              Master subjects from elementary to high school through interactive games and AI-powered video
              recommendations.
            </p>
            <Button
              onClick={() => setShowAuth(true)}
              size="lg"
              className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0"
            >
              Start Learning Today
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-16 px-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">Interactive Games</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  Learn through engaging games covering all subjects from elementary to high school level.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Play className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">AI Video Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  Get personalized YouTube video recommendations and AI-powered summaries for any topic.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  Track your learning journey with detailed analytics and achievement badges.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mx-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600 text-sm md:text-base">Students Learning</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm md:text-base">Interactive Games</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600 text-sm md:text-base">Subjects Covered</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-gray-600 text-sm md:text-base">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onSuccess={(userData) => {
            setIsAuthenticated(true)
            setUser(userData)
            setShowAuth(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900">LearnPlay</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Button variant={currentView === "home" ? "default" : "ghost"} onClick={() => setCurrentView("home")}>
                Home
              </Button>
              <Button variant={currentView === "games" ? "default" : "ghost"} onClick={() => setCurrentView("games")}>
                Games
              </Button>
              <Button
                variant={currentView === "advanced-games" ? "default" : "ghost"}
                onClick={() => setCurrentView("advanced-games")}
              >
                Advanced Games
              </Button>
              <Button
                variant={currentView === "endless-quiz" ? "default" : "ghost"}
                onClick={() => setCurrentView("endless-quiz")}
              >
                Endless Quiz
              </Button>
              <Button variant={currentView === "videos" ? "default" : "ghost"} onClick={() => setCurrentView("videos")}>
                Videos
              </Button>
              <Button variant={currentView === "chat" ? "default" : "ghost"} onClick={() => setCurrentView("chat")}>
                AI Chat
              </Button>
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                onClick={() => setCurrentView("dashboard")}
              >
                Dashboard
              </Button>

              <div className="flex items-center space-x-2">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-900">{user?.points || 1250}</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-100 p-1 rounded-full">
                  <Star className="h-3 w-3 text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">{user?.points || 1250}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <div className="flex flex-col space-y-2">
                <Button
                  variant={currentView === "home" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("home")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  Home
                </Button>
                <Button
                  variant={currentView === "games" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("games")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  Games
                </Button>
                <Button
                  variant={currentView === "advanced-games" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("advanced-games")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  Advanced Games
                </Button>
                <Button
                  variant={currentView === "endless-quiz" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("endless-quiz")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  Endless Quiz
                </Button>
                <Button
                  variant={currentView === "videos" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("videos")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  Videos
                </Button>
                <Button
                  variant={currentView === "chat" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("chat")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  AI Chat
                </Button>
                <Button
                  variant={currentView === "dashboard" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentView("dashboard")
                    setMobileMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        {currentView === "home" && (
          <div className="space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome back, {user?.name || "Student"}! 🎉</h2>
              <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">
                You're doing great! Keep up the momentum and continue your learning journey.
              </p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Level {user?.level || 8}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">{user?.points || 1250} Points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Rank #{user?.rank || 42}</span>
                </div>
              </div>
            </div>

            {/* Subject Progress */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Your Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {subjects.map((subject, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl md:text-2xl">{subject.icon}</span>
                          <div>
                            <CardTitle className="text-base md:text-lg">{subject.name}</CardTitle>
                            <CardDescription className="text-sm">Level {subject.level}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {subject.progress}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={subject.progress} className="mb-3" />
                      <Button size="sm" className="w-full text-xs md:text-sm">
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={index} className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="text-center">
                      <div className="text-3xl md:text-4xl mb-2">{achievement.icon}</div>
                      <CardTitle className="text-base md:text-lg">{achievement.title}</CardTitle>
                      <CardDescription className="text-sm">{achievement.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === "games" && <GameCard />}
        {currentView === "advanced-games" && <AdvancedGames />}
        {currentView === "endless-quiz" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Endless Quiz Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Select value={quizSubject} onValueChange={setQuizSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Math">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <Select value={quizDifficulty} onValueChange={setQuizDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <EndlessQuiz subject={quizSubject} difficulty={quizDifficulty} />
          </div>
        )}
        {currentView === "videos" && <VideoSuggestions />}
        {currentView === "chat" && <AIChatbot />}
        {currentView === "dashboard" && <Dashboard />}
      </main>
    </div>
  )
}
