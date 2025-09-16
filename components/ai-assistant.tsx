"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI learning assistant. I can help you with any subject questions, study tips, or learning strategies. What would you like to learn about today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

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
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          context: "Student learning assistance",
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-fit mx-auto mb-4">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Learning Assistant</h2>
        <p className="text-gray-600">Ask me anything about your studies!</p>
      </div>

      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Chat with AI Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      <span className="text-xs opacity-75">{message.sender === "user" ? "You" : "AI Assistant"}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-xs opacity-75">AI Assistant</span>
                    </div>
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about any subject..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
