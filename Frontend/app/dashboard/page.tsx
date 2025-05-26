"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, Target, Code, Star, Flame, Award, Activity, Calendar, ChevronDown, X, Info } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
]

// Generate yearly heatmap data (GitHub style - last 365 days)
const generateGitHubStyleHeatmapData = (year: number) => {
  const data = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setFullYear(startDate.getFullYear() - 1)
  startDate.setDate(startDate.getDate() + 1) // Start from exactly 365 days ago

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]

    // Generate random problem counts for each platform
    const leetcode = Math.floor(Math.random() * 6) // 0-5 problems
    const codechef = Math.floor(Math.random() * 4) // 0-3 problems
    const hackerrank = Math.floor(Math.random() * 4) // 0-3 problems
    const geeksforgeeks = Math.floor(Math.random() * 3) // 0-2 problems
    const codeforces = Math.floor(Math.random() * 3) // 0-2 problems

    const total = leetcode + codechef + hackerrank + geeksforgeeks + codeforces

    data.push({
      date: dateStr,
      total,
      platforms: {
        LeetCode: leetcode,
        CodeChef: codechef,
        HackerRank: hackerrank,
        GeeksforGeeks: geeksforgeeks,
        Codeforces: codeforces,
      },
      day: d.getDay(),
      month: d.getMonth(),
      year: d.getFullYear(),
    })
  }

  return data
}

// Get intensity level based on problem count
const getIntensity = (count: number) => {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 8) return 3
  return 4
}

// Get color class based on intensity
const getHeatmapColor = (intensity: number) => {
  switch (intensity) {
    case 0:
      return "bg-gray-800"
    case 1:
      return "bg-green-900"
    case 2:
      return "bg-green-700"
    case 3:
      return "bg-green-500"
    case 4:
      return "bg-green-400"
    default:
      return "bg-gray-800"
  }
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Available years (current year and past 3 years)
const currentYear = new Date().getFullYear()
const availableYears = Array.from({ length: 4 }, (_, i) => currentYear - i)

export default function DashboardPage() {
  const totalSolved = platformStats.reduce((sum, platform) => sum + platform.solved, 0)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedDay, setSelectedDay] = useState<any>(null)
  const [showDayDetails, setShowDayDetails] = useState(false)

  const heatmapData = generateGitHubStyleHeatmapData(selectedYear)

  const handleDayClick = (dayData: any) => {
    setSelectedDay(dayData)
    setShowDayDetails(true)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate statistics
  const totalSubmissions = heatmapData.reduce((sum, day) => sum + day.total, 0)
  const activeDays = heatmapData.filter((day) => day.total > 0).length

  // Calculate max streak
  let maxStreak = 0
  let currentStreak = 0
  let currentStreakCount = 0

  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].total > 0) {
      currentStreak++
      if (i === heatmapData.length - 1 || heatmapData[i + 1].total > 0) {
        currentStreakCount = currentStreak
      }
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 0
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak)

  // Group data by months properly
  const groupDataByMonths = () => {
    const monthGroups = []

    // Get unique months in chronological order
    const uniqueMonths = []
    const seenMonths = new Set()

    heatmapData.forEach((day) => {
      const monthKey = `${day.year}-${day.month}`
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey)
        uniqueMonths.push({ year: day.year, month: day.month })
      }
    })

    uniqueMonths.forEach(({ year, month }) => {
      // Get all days for this specific month
      const monthDays = heatmapData.filter((day) => day.year === year && day.month === month)

      if (monthDays.length === 0) return

      // Find the first day of the month to determine starting day of week
      const firstDay = new Date(year, month, 1)
      const startDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

      // Create weeks for this month
      const monthWeeks = []
      let currentWeek = []

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null)
      }

      // Add all days of the month in chronological order
      monthDays.forEach((dayData) => {
        currentWeek.push(dayData)

        if (currentWeek.length === 7) {
          monthWeeks.push([...currentWeek])
          currentWeek = []
        }
      })

      // Add remaining days to the last week if needed
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push(null)
        }
        monthWeeks.push(currentWeek)
      }

      monthGroups.push({
        year,
        month,
        monthName: monthLabels[month],
        weeks: monthWeeks,
        dayCount: monthDays.length,
      })
    })

    return monthGroups
  }

  const monthGroups = groupDataByMonths()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-950">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-6 bg-gray-900/50">
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
        <div className="flex flex-1 flex-col gap-8 p-6 bg-gray-950">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
              <p className="text-gray-400 text-lg">Here's your coding journey overview</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2 font-medium">
                <Flame className="h-4 w-4 mr-2" />
                15 day streak
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <CardTitle className="text-sm font-medium text-gray-300">Avg Rating</CardTitle>
                <Star className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1781</div>
                <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +45 from last month
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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            {/* Platform Stats */}
            <Card className="col-span-4 card-professional">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            platform.color === "orange"
                              ? "bg-orange-500"
                              : platform.color === "amber"
                                ? "bg-amber-500"
                                : platform.color === "green"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                          }`}
                        />
                        <p className="text-base font-semibold text-white">{platform.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={platform.connected ? "default" : "secondary"}
                          className={`${
                            platform.connected
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {platform.rank}
                        </Badge>
                        <span className="text-base font-semibold text-orange-400">{platform.rating}</span>
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

            {/* Recent Activity */}
            <Card className="col-span-3 card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400">Your latest coding submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xs">
                          {activity.platform.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-white">{activity.problem}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${
                              activity.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : activity.difficulty === "Medium"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {activity.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-400">{activity.platform}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            activity.status === "Solved"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-700 text-gray-300"
                          }
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GitHub-Style Activity Heatmap */}
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    {totalSubmissions} submissions in the past one year
                  </h3>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <span>Total active days: {activeDays}</span>
                  <span>Max streak: {maxStreak}</span>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-24 bg-gray-900 border-gray-700 text-white h-8">
                      <SelectValue />
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-800">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Heatmap Grid */}
                <div className="flex gap-1">
                  {/* Day labels */}
                  <div className="flex flex-col gap-1 mr-3">
                    {dayLabels.map((day, index) => (
                      <div key={day} className="h-3 text-xs text-gray-400 flex items-center w-6">
                        {index % 2 === 1 ? day.slice(0, 3) : ""}
                      </div>
                    ))}
                  </div>

                  {/* Grid container with horizontal scroll */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-4 min-w-max">
                      {monthGroups.map((monthGroup, monthIndex) => (
                        <div key={`${monthGroup.year}-${monthGroup.month}`} className="flex flex-col">
                          {/* Month weeks */}
                          <div className="flex gap-1">
                            {monthGroup.weeks.map((week, weekIndex) => (
                              <div key={weekIndex} className="flex flex-col gap-1">
                                {week.map((dayData, dayIndex) => {
                                  if (!dayData) {
                                    return <div key={dayIndex} className="w-3 h-3"></div>
                                  }

                                  const intensity = getIntensity(dayData.total)
                                  const colorClass = getHeatmapColor(intensity)

                                  return (
                                    <div
                                      key={dayIndex}
                                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-gray-400 ${colorClass}`}
                                      title={`${dayData.date}: ${dayData.total} problems solved`}
                                      onClick={() => handleDayClick(dayData)}
                                    />
                                  )
                                })}
                              </div>
                            ))}
                          </div>

                          {/* Month label */}
                          <div className="text-xs text-gray-400 text-center mt-2">{monthGroup.monthName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((intensity) => (
                        <div key={intensity} className={`w-3 h-3 rounded-sm ${getHeatmapColor(intensity)}`} />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                  <div className="text-xs text-gray-400">Learn how we count contributions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      {/* Day Details Dialog */}
      <Dialog open={showDayDetails} onOpenChange={setShowDayDetails}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">{selectedDay && formatDate(selectedDay.date)}</DialogTitle>
              <button
                onClick={() => setShowDayDetails(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DialogDescription className="text-gray-400">Problems solved on this day</DialogDescription>
          </DialogHeader>

          {selectedDay && (
            <div className="space-y-4">
              {/* Total Problems */}
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">Total Problems</span>
                  <span className="text-2xl font-bold text-white">{selectedDay.total}</span>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Platform Breakdown</h4>
                {Object.entries(selectedDay.platforms).map(([platform, count]) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          platform === "LeetCode"
                            ? "bg-orange-500"
                            : platform === "CodeChef"
                              ? "bg-amber-500"
                              : platform === "HackerRank"
                                ? "bg-green-500"
                                : platform === "GeeksforGeeks"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                        }`}
                      />
                      <span className="text-gray-300 font-medium">{platform}</span>
                    </div>
                    <Badge
                      className={`${
                        count > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-700 text-gray-400 border-gray-600"
                      }`}
                    >
                      {count} {count === 1 ? "problem" : "problems"}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Activity Summary */}
              {selectedDay.total > 0 && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-green-400 font-medium">
                      Great job! You solved {selectedDay.total} {selectedDay.total === 1 ? "problem" : "problems"} on
                      this day.
                    </span>
                  </div>
                </div>
              )}

              {selectedDay.total === 0 && (
                <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">No problems solved on this day.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
