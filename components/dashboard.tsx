"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Trophy, Star, Clock, Target, TrendingUp, BookOpen, Award, Calendar } from "lucide-react"

export default function Dashboard() {
  const weeklyProgress = [
    { day: "Mon", points: 120, time: 45 },
    { day: "Tue", points: 150, time: 60 },
    { day: "Wed", points: 90, time: 30 },
    { day: "Thu", points: 200, time: 75 },
    { day: "Fri", points: 180, time: 65 },
    { day: "Sat", points: 220, time: 80 },
    { day: "Sun", points: 160, time: 55 },
  ]

  const subjectProgress = [
    { subject: "Math", completed: 85, total: 100, color: "#3B82F6" },
    { subject: "Science", completed: 72, total: 100, color: "#10B981" },
    { subject: "English", completed: 90, total: 100, color: "#8B5CF6" },
    { subject: "History", completed: 65, total: 100, color: "#F59E0B" },
    { subject: "Geography", completed: 78, total: 100, color: "#EF4444" },
  ]

  const skillDistribution = [
    { name: "Problem Solving", value: 35, color: "#3B82F6" },
    { name: "Critical Thinking", value: 25, color: "#10B981" },
    { name: "Creativity", value: 20, color: "#8B5CF6" },
    { name: "Communication", value: 20, color: "#F59E0B" },
  ]

  const recentAchievements = [
    { title: "Math Master", date: "2 days ago", icon: "🔢", color: "bg-blue-100 text-blue-800" },
    { title: "Science Explorer", date: "1 week ago", icon: "🔬", color: "bg-green-100 text-green-800" },
    { title: "Reading Champion", date: "2 weeks ago", icon: "📚", color: "bg-purple-100 text-purple-800" },
    { title: "History Buff", date: "3 weeks ago", icon: "🏛️", color: "bg-orange-100 text-orange-800" },
  ]

  const upcomingGoals = [
    { title: "Complete Algebra Module", progress: 75, dueDate: "In 3 days" },
    { title: "Finish Chemistry Lab", progress: 40, dueDate: "In 1 week" },
    { title: "Read 5 History Articles", progress: 60, dueDate: "In 2 weeks" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Analytics Dashboard</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your progress, analyze your learning patterns, and celebrate your achievements.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+180 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Completed</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level 8</div>
            <p className="text-xs text-muted-foreground">250 XP to Level 9</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Weekly Progress</span>
            </CardTitle>
            <CardDescription>Points earned and time spent learning each day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="points" stroke="#3B82F6" strokeWidth={2} name="Points" />
                <Line type="monotone" dataKey="time" stroke="#10B981" strokeWidth={2} name="Time (min)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Subject Progress</span>
            </CardTitle>
            <CardDescription>Your progress across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills and Achievements Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Skill Development</span>
            </CardTitle>
            <CardDescription>Distribution of skills you're developing</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>Your latest accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{achievement.title}</div>
                    <div className="text-sm text-gray-500">{achievement.date}</div>
                  </div>
                  <Badge className={achievement.color}>New</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Goals</span>
          </CardTitle>
          <CardDescription>Track your progress towards learning objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {upcomingGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-gray-500">{goal.dueDate}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="text-sm text-gray-600">{goal.progress}% complete</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
