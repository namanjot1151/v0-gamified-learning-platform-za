"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Loader2, Sparkles, BookOpen, Brain, Lightbulb } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI learning assistant. I can help you with Math, Science, English, History, Geography, and more! What would you like to learn about today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context: "Educational learning platform for rural students",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again or explore our educational games!",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "Explain photosynthesis",
    "Help with algebra",
    "World War 2 facts",
    "Grammar rules",
    "Geography quiz",
    "Chemistry basics",
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-600" />
          AI Learning Assistant
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get instant help with your studies! Ask questions about any subject, get explanations, solve problems, and
          enhance your learning experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900">Subject Help</h3>
            <p className="text-sm text-blue-700">Get explanations for Math, Science, English, and more</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-900">Problem Solving</h3>
            <p className="text-sm text-purple-700">Step-by-step solutions and guidance</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900">Study Tips</h3>
            <p className="text-sm text-green-700">Learning strategies and study techniques</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Chat with AI Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "ai" && <Bot className="h-4 w-4 mt-1 text-purple-600 flex-shrink-0" />}
                      {message.sender === "user" && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2 mb-3">
              <Input
                placeholder="Ask me anything about your studies..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
