"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, Target, Code, Star, Flame, Award, Activity, Plus, Trash2, Edit3, Check, X } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

const platformStats = [
  {
    name: "LeetCode",
    solved: 245,
    total: 3000,
    rating: 1850,
    rank: "Expert",
    connected: true,
    color: "orange",
  },
  {
    name: "CodeChef",
    solved: 89,
    total: 1500,
    rating: 1654,
    rank: "3 Star",
    connected: true,
    color: "amber",
  },
  {
    name: "HackerRank",
    solved: 156,
    total: 800,
    rating: 2100,
    rank: "Gold",
    connected: true,
    color: "green",
  },
  {
    name: "GeeksforGeeks",
    solved: 78,
    total: 1200,
    rating: 1420,
    rank: "Intermediate",
    connected: false,
    color: "gray",
  },
]

const recentActivity = [
  {
    platform: "LeetCode",
    problem: "Two Sum",
    difficulty: "Easy",
    time: "2 hours ago",
    status: "Solved",
  },
  {
    platform: "CodeChef",
    problem: "Chef and Strings",
    difficulty: "Medium",
    time: "5 hours ago",
    status: "Solved",
  },
  {
    platform: "HackerRank",
    problem: "Array Manipulation",
    difficulty: "Hard",
    time: "1 day ago",
    status: "Attempted",
  },
  {
    platform: "LeetCode",
    problem: "Valid Parentheses",
    difficulty: "Easy",
    time: "2 days ago",
    status: "Solved",
  },
  {
    platform: "CodeChef",
    problem: "Binary Search",
    difficulty: "Medium",
    time: "3 days ago",
    status: "Solved",
  },
]

interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

// Rank system
const rankSystem = [
  { title: "Bronze", minXP: 0, maxXP: 499, color: "text-amber-600", icon: () => <span>🥉</span> },
  { title: "Silver", minXP: 500, maxXP: 999, color: "text-gray-400", icon: () => <span>🥈</span> },
  { title: "Gold", minXP: 1000, maxXP: 1999, color: "text-yellow-500", icon: () => <span>🥇</span> },
  { title: "Platinum", minXP: 2000, maxXP: 3499, color: "text-cyan-400", icon: () => <span>💎</span> },
  { title: "Diamond", minXP: 3500, maxXP: 4999, color: "text-blue-400", icon: () => <span>💠</span> },
  { title: "Ace", minXP: 5000, maxXP: 7499, color: "text-purple-500", icon: () => <span>⚡</span> },
  { title: "Ace-1", minXP: 7500, maxXP: 9999, color: "text-purple-600", icon: () => <span>🔥</span> },
  { title: "Ace-2", minXP: 10000, maxXP: 12499, color: "text-purple-700", icon: () => <span>🎯</span> },
  { title: "Conqueror", minXP: 12500, maxXP: 14999, color: "text-red-500", icon: () => <span>🛡️</span> },
  { title: "Legendary", minXP: 15000, maxXP: 19999, color: "text-orange-500", icon: () => <span>👑</span> },
  {
    title: "Code Verse Grandmaster",
    minXP: 20000,
    maxXP: Number.POSITIVE_INFINITY,
    color: "text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text",
    icon: () => <span>✨</span>,
  },
]

const getCurrentRank = (xp: number) => {
  for (let i = rankSystem.length - 1; i >= 0; i--) {
    if (xp >= rankSystem[i].minXP) {
      return rankSystem[i]
    }
  }
  return rankSystem[0]
}

export default function DashboardPage() {
  const totalSolved = platformStats.reduce((sum, platform) => sum + platform.solved, 0)
  const [userName, setUserName] = useState("John")
  const [currentXP, setCurrentXP] = useState(2750) // Example XP
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "1",
      text: "Solve 5 LeetCode problems this week",
      completed: false,
      createdAt: new Date(),
    },
    {
      id: "2",
      text: "Complete Dynamic Programming course",
      completed: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      text: "Practice binary tree problems",
      completed: false,
      createdAt: new Date(),
    },
  ])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")

  const currentRank = getCurrentRank(currentXP)

  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        const storedUserData = localStorage.getItem("userData")
        if (storedUserData) {
          const user = JSON.parse(storedUserData)
          setUserName(user.firstName || "John")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    getUserData()
  }, [])

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTodos([todo, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEditing = (id: string, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim() && editingId) {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editingText.trim() } : todo)))
      setEditingId(null)
      setEditingText("")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText("")
  }

  // Platform logo component
  const PlatformLogo = ({ platform, size = "w-full h-full" }: { platform: string; size?: string }) => {
    switch (platform) {
      case "LeetCode":
        return (
          <svg viewBox="0 0 24 24" className={size} fill="currentColor">
            <path
              d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"
              className="text-orange-500"
            />
          </svg>
        )
      case "CodeChef":
        return (
          <svg viewBox="0 0 24 24" className={size} fill="currentColor">
            <path
              d="M11.257.004c-.37 0-.74.006-1.108.02C4.764.147.53 3.97.004 9.279c-.571 5.748 3.466 11.15 9.214 11.721 5.748.571 11.15-3.466 11.721-9.214.571-5.748-3.466-11.15-9.214-11.721-.37-.037-.74-.055-1.108-.061zm-.001 1.647c.31 0 .62.005.928.016 4.84.394 8.698 4.46 8.304 9.3-.394 4.84-4.46 8.698-9.3 8.304-4.84-.394-8.698-4.46-8.304-9.3.394-4.84 4.46-8.698 9.3-8.304.024-.001.048-.016.072-.016zm.001 2.372c-3.616 0-6.549 2.933-6.549 6.549s2.933 6.549 6.549 6.549 6.549-2.933 6.549-6.549-2.933-6.549-6.549-6.549z"
              className="text-amber-500"
            />
          </svg>
        )
      case "HackerRank":
        return (
          <svg viewBox="0 0 24 24" className={size} fill="currentColor">
            <path
              d="M12 0c1.285 0 9.75 4.886 10.392 6 .642 1.114.642 10.886 0 12C21.75 19.114 13.285 24 12 24s-9.75-4.886-10.392-6c-.642-1.114-.642-10.886 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.141-.115-.258-.258-.258H8.963c-.141 0-.258.115-.258.258v9.886c0 .141.115.258.258.258h.742c.141 0 .258-.115.258-.258v-4.629h4.074v4.629c0 .141.115.258.258.258h.742c.141 0 .258-.115.258-.258V7.057c0-.141-.115-.258-.258-.258h-.742z"
              className="text-green-500"
            />
          </svg>
        )
      case "GeeksforGeeks":
        return (
          <svg viewBox="0 0 24 24" className={size} fill="currentColor">
            <path
              d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.565 4.677 4.677 0 0 1-1.42.197 4.522 4.522 0 0 1-1.746-.35 4.35 4.35 0 0 1-1.428-.992 4.647 4.647 0 0 1-.955-1.51 5.006 5.006 0 0 1-.349-1.872 5.789 5.789 0 0 1 .35-2.017 4.651 4.651 0 0 1 .955-1.51 4.35 4.35 0 0 1 1.428-.992 4.522 4.522 0 0 1 1.746-.35c.493 0 .98.07 1.42.197.44.127.835.308 1.104.565.231.213.422.465.565.745.143.28.197.565.197.85 0 .143-.028.28-.07.412a1.07 1.07 0 0 1-.197.334c-.084.098-.197.175-.322.224a1.13 1.13 0 0 1-.412.07c-.14 0-.28-.028-.412-.07a1.13 1.13 0 0 1-.322-.224 1.07 1.07 0 0 1-.197-.334 1.13 1.13 0 0 1-.07-.412c0-.098.014-.197.042-.294.028-.098.07-.189.126-.273.056-.084.126-.154.21-.21.084-.056.182-.098.294-.126.112-.028.224-.042.322-.042.098 0 .197.014.294.042.098.028.189.07.273.126.084.056.154.126.21.21.056.084.098.175.126.273.028.098.042.196.042.294 0 .285-.054.57-.197.85z"
              className="text-gray-400"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-950">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 lg:px-6 bg-gray-900/50">
          <SidebarTrigger className="-ml-1 text-gray-400 hover:text-orange-500" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-gray-700" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-300 font-medium">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl p-4 lg:p-6 space-y-6">
            {/* Welcome Section with Rank */}
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Welcome back, {userName}!</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <p className="text-gray-400 text-sm sm:text-base">Here's your coding journey overview</p>
                  <Badge
                    className={`${currentRank.color} bg-gray-800/50 border-gray-700 flex items-center gap-1 w-fit`}
                  >
                    <currentRank.icon />
                    {currentRank.title}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg">
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>15 day streak</span>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{currentXP.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Solved</CardTitle>
                  <Code className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalSolved}</div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12 from last week
                  </p>
                </CardContent>
              </Card>
              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Current Rank</CardTitle>
                  <currentRank.icon />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${currentRank.color}`}>{currentRank.title}</div>
                  <p className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3" />
                    {currentXP.toLocaleString()} XP
                  </p>
                </CardContent>
              </Card>
              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Current Streak</CardTitle>
                  <Flame className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">15 days</div>
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <Activity className="h-3 w-3" />
                    Keep it up!
                  </p>
                </CardContent>
              </Card>
              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">This Week</CardTitle>
                  <Target className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">23</div>
                  <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    Problems solved
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Platform Stats */}
              <Card className="lg:col-span-2 card-professional">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-500" />
                    Platform Overview
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your performance across different coding platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {platformStats.map((platform) => (
                    <div key={platform.name} className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center p-1 sm:p-1.5 flex-shrink-0">
                            <PlatformLogo platform={platform.name} />
                          </div>
                          <p className="text-sm sm:text-base font-semibold text-white truncate">{platform.name}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            {platform.rank}
                          </div>
                          <span className="text-sm sm:text-base font-semibold text-orange-400">{platform.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">
                          {platform.solved}/{platform.total} solved
                        </span>
                        <span className="text-gray-400">{Math.round((platform.solved / platform.total) * 100)}%</span>
                      </div>
                      <Progress value={(platform.solved / platform.total) * 100} className="h-2 bg-gray-800" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Todo List */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Todo List
                  </CardTitle>
                  <CardDescription className="text-gray-400">Track your coding goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add new todo */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a new task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTodo()}
                        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <Button onClick={addTodo} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-3">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Todo items */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {todos.map((todo) => (
                        <div
                          key={todo.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            todo.completed ? "bg-green-500/10 border-green-500/30" : "bg-gray-900/50 border-gray-800"
                          }`}
                        >
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="border-gray-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />

                          {editingId === todo.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                                className="bg-gray-800 border-gray-600 text-white text-sm"
                                autoFocus
                              />
                              <Button
                                onClick={saveEdit}
                                size="sm"
                                variant="ghost"
                                className="text-green-500 hover:text-green-400 p-1"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-400 p-1"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span
                                className={`flex-1 text-sm ${
                                  todo.completed ? "text-green-400 line-through" : "text-gray-300"
                                }`}
                              >
                                {todo.text}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => startEditing(todo.id, todo.text)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-blue-400 p-1"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  onClick={() => deleteTodo(todo.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-red-400 p-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Todo stats */}
                    <div className="pt-3 border-t border-gray-800">
                      <div className="grid grid-cols-3 gap-2 text-center text-sm text-gray-400">
                        <div>
                          <div className="font-semibold text-white">{todos.length}</div>
                          <div>Total</div>
                        </div>
                        <div>
                          <div className="font-semibold text-green-400">{todos.filter((t) => t.completed).length}</div>
                          <div>Done</div>
                        </div>
                        <div>
                          <div className="font-semibold text-orange-400">
                            {todos.filter((t) => !t.completed).length}
                          </div>
                          <div>Left</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - Grid Layout */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">Your latest coding submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3 sm:gap-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center p-1.5">
                          <PlatformLogo platform={activity.platform} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{activity.problem}</p>
                          <p className="text-xs text-gray-400">{activity.platform}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs pointer-events-none ${
                              activity.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : activity.difficulty === "Medium"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {activity.difficulty}
                          </Badge>
                          <Badge
                            className={`pointer-events-none ${
                              activity.status === "Solved"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
