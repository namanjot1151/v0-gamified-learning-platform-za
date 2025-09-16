"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User, GraduationCap } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
    school: "",
  })

  const handleSubmit = async (type: "login" | "signup") => {
    setIsLoading(true)
    setError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful authentication
      const userData = {
        id: "1",
        name: formData.name || "Student",
        email: formData.email,
        grade: formData.grade || "8th Grade",
        school: formData.school || "Rural High School",
        points: 1250,
        level: 8,
        rank: 42,
        joinedDate: new Date().toISOString(),
      }

      onSuccess(userData)
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Join LearnPlay</DialogTitle>
          <DialogDescription className="text-center">Start your gamified learning journey today</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Account</CardTitle>
                <CardDescription>Join thousands of students learning through games</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Level</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="grade"
                      placeholder="e.g., 8th Grade"
                      className="pl-10"
                      value={formData.grade}
                      onChange={(e) => handleInputChange("grade", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School Name</Label>
                  <Input
                    id="school"
                    placeholder="Enter your school name"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={() => handleSubmit("signup")} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome Back</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={() => handleSubmit("login")} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
