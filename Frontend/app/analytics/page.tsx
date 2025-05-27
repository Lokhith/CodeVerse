"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Target,
  Activity,
  Award,
  Calendar,
  TrendingUp,
  ChevronDown,
  Info,
  Code,
  Star,
  Flame,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Platform data with difficulty breakdown
const platformData = [
  {
    name: "LeetCode",
    total: 245,
    easy: { solved: 145, total: 200 },
    medium: { solved: 89, total: 150 },
    hard: { solved: 11, total: 80 },
    color: "orange",
    logo: "LeetCode",
  },
  {
    name: "CodeChef",
    total: 89,
    easy: { solved: 45, total: 80 },
    medium: { solved: 32, total: 70 },
    hard: { solved: 12, total: 50 },
    color: "amber",
    logo: "CodeChef",
  },
  {
    name: "HackerRank",
    total: 156,
    easy: { solved: 78, total: 100 },
    medium: { solved: 56, total: 80 },
    hard: { solved: 22, total: 60 },
    color: "green",
    logo: "HackerRank",
  },
  {
    name: "GeeksforGeeks",
    total: 78,
    easy: { solved: 42, total: 60 },
    medium: { solved: 28, total: 50 },
    hard: { solved: 8, total: 40 },
    color: "gray",
    logo: "GeeksforGeeks",
  },
]

// Calculate totals
const totalProblems = platformData.reduce((sum, platform) => sum + platform.total, 0)
const averageRating = 1781
const problemsToday = 5
const weeklyGoal = 30
const weeklyProgress = 23

// Generate yearly heatmap data (GitHub style - last 365 days)
const generateGitHubStyleHeatmapData = (year: number) => {
  const data = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setFullYear(startDate.getFullYear() - 1)
  startDate.setDate(startDate.getDate() + 1)

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    const total = Math.floor(Math.random() * 8)

    data.push({
      date: dateStr,
      total,
      platforms: {
        LeetCode: Math.floor(Math.random() * 4),
        CodeChef: Math.floor(Math.random() * 3),
        HackerRank: Math.floor(Math.random() * 3),
        GeeksforGeeks: Math.floor(Math.random() * 2),
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
  if (count <= 4) return 2
  if (count <= 6) return 3
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

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"]
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Available years
const currentYear = new Date().getFullYear()
const availableYears = Array.from({ length: 4 }, (_, i) => currentYear - i)

export default function AnalyticsPage() {
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

  // Calculate heatmap statistics
  const totalSubmissions = heatmapData.reduce((sum, day) => sum + day.total, 0)
  const activeDays = heatmapData.filter((day) => day.total > 0).length

  // Calculate max streak
  let maxStreak = 0
  let currentStreak = 0
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].total > 0) {
      currentStreak++
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 0
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak)

  // Group data by months for mobile-friendly display
  const groupDataByMonths = () => {
    const monthGroups = []
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
      const monthDays = heatmapData.filter((day) => day.year === year && day.month === month)
      if (monthDays.length === 0) return

      const firstDay = new Date(year, month, 1)
      const startDayOfWeek = firstDay.getDay()
      const monthWeeks = []
      let currentWeek = []

      for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null)
      }

      monthDays.forEach((dayData) => {
        currentWeek.push(dayData)
        if (currentWeek.length === 7) {
          monthWeeks.push([...currentWeek])
          currentWeek = []
        }
      })

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
                <BreadcrumbLink href="/dashboard" className="text-gray-400 hover:text-orange-500">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-300 font-medium">Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500" />
                Analytics
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Detailed insights into your coding performance
              </p>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Problems</CardTitle>
                  <Code className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-orange-500" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{totalProblems}</div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                    +12 this week
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Avg Rating</CardTitle>
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-500" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{averageRating}</div>
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                    +45 this month
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Today</CardTitle>
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-500" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{problemsToday}</div>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <Activity className="h-2 w-2 sm:h-3 sm:w-3" />
                    Great!
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional card-professional-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Weekly</CardTitle>
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-red-500" />
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {weeklyProgress}/{weeklyGoal}
                  </div>
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                    {Math.round((weeklyProgress / weeklyGoal) * 100)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Platform-wise Breakdown */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                Platform Performance
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {platformData.map((platform) => (
                  <Card key={platform.name} className="card-professional">
                    <CardHeader className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center p-1.5 sm:p-2">
                          <PlatformLogo platform={platform.logo} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm sm:text-base lg:text-lg text-white truncate">
                            {platform.name}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-gray-400">
                            {platform.total} solved
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-3 sm:space-y-4">
                      {/* Total Progress */}
                      <div className="p-3 sm:p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-300">Total</span>
                          <span className="text-sm sm:text-base lg:text-lg font-bold text-white">{platform.total}</span>
                        </div>
                        <Progress value={75} className="h-1.5 sm:h-2 bg-gray-800 [&>div]:bg-blue-500" />
                      </div>

                      {/* Difficulty Breakdown */}
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-300">Difficulty</h4>

                        {/* Easy */}
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500" />
                              <span className="text-xs sm:text-sm text-gray-300">Easy</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-300">
                              {platform.easy.solved}/{platform.easy.total}
                            </span>
                          </div>
                          <Progress
                            value={(platform.easy.solved / platform.easy.total) * 100}
                            className="h-1 sm:h-1.5 bg-gray-800 [&>div]:bg-emerald-500"
                          />
                        </div>

                        {/* Medium */}
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                              <span className="text-xs sm:text-sm text-gray-300">Medium</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-300">
                              {platform.medium.solved}/{platform.medium.total}
                            </span>
                          </div>
                          <Progress
                            value={(platform.medium.solved / platform.medium.total) * 100}
                            className="h-1 sm:h-1.5 bg-gray-800 [&>div]:bg-yellow-500"
                          />
                        </div>

                        {/* Hard */}
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-rose-500" />
                              <span className="text-xs sm:text-sm text-gray-300">Hard</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-300">
                              {platform.hard.solved}/{platform.hard.total}
                            </span>
                          </div>
                          <Progress
                            value={(platform.hard.solved / platform.hard.total) * 100}
                            className="h-1 sm:h-1.5 bg-gray-800 [&>div]:bg-rose-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Activity Heatmap */}
            <Card className="card-professional">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                      {totalSubmissions} submissions this year
                    </h3>
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                    <span>Active days: {activeDays}</span>
                    <span>Max streak: {maxStreak}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 sm:gap-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white rounded-md text-xs hover:bg-gray-800 transition-colors">
                          {selectedYear}
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900 border-gray-700">
                        {availableYears.map((year) => (
                          <DropdownMenuItem
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className="text-white hover:bg-gray-800 text-xs cursor-pointer"
                          >
                            {year}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {/* Mobile Heatmap - 4x3 Grid Layout */}
                  <div className="block sm:hidden">
                    <div className="space-y-3">
                      {/* First Row - 4 months */}
                      <div className="grid grid-cols-4 gap-2">
                        {monthGroups.slice(-12, -8).map((monthGroup, monthIndex) => (
                          <div key={`${monthGroup.year}-${monthGroup.month}`} className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium text-center">
                              {monthGroup.monthName.slice(0, 3)}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {monthGroup.weeks.slice(0, 4).map((week, weekIndex) => (
                                <div key={weekIndex} className="flex gap-0.5">
                                  {week.map((dayData, dayIndex) => {
                                    if (!dayData) {
                                      return <div key={dayIndex} className="w-1.5 h-1.5"></div>
                                    }

                                    const intensity = getIntensity(dayData.total)
                                    const colorClass = getHeatmapColor(intensity)

                                    return (
                                      <div
                                        key={dayIndex}
                                        className={`w-1.5 h-1.5 rounded-sm cursor-pointer ${colorClass}`}
                                        onClick={() => handleDayClick(dayData)}
                                      />
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Second Row - 4 months */}
                      <div className="grid grid-cols-4 gap-2">
                        {monthGroups.slice(-8, -4).map((monthGroup, monthIndex) => (
                          <div key={`${monthGroup.year}-${monthGroup.month}`} className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium text-center">
                              {monthGroup.monthName.slice(0, 3)}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {monthGroup.weeks.slice(0, 4).map((week, weekIndex) => (
                                <div key={weekIndex} className="flex gap-0.5">
                                  {week.map((dayData, dayIndex) => {
                                    if (!dayData) {
                                      return <div key={dayIndex} className="w-1.5 h-1.5"></div>
                                    }

                                    const intensity = getIntensity(dayData.total)
                                    const colorClass = getHeatmapColor(intensity)

                                    return (
                                      <div
                                        key={dayIndex}
                                        className={`w-1.5 h-1.5 rounded-sm cursor-pointer ${colorClass}`}
                                        onClick={() => handleDayClick(dayData)}
                                      />
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Third Row - 4 months */}
                      <div className="grid grid-cols-4 gap-2">
                        {monthGroups.slice(-4).map((monthGroup, monthIndex) => (
                          <div key={`${monthGroup.year}-${monthGroup.month}`} className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium text-center">
                              {monthGroup.monthName.slice(0, 3)}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              {monthGroup.weeks.slice(0, 4).map((week, weekIndex) => (
                                <div key={weekIndex} className="flex gap-0.5">
                                  {week.map((dayData, dayIndex) => {
                                    if (!dayData) {
                                      return <div key={dayIndex} className="w-1.5 h-1.5"></div>
                                    }

                                    const intensity = getIntensity(dayData.total)
                                    const colorClass = getHeatmapColor(intensity)

                                    return (
                                      <div
                                        key={dayIndex}
                                        className={`w-1.5 h-1.5 rounded-sm cursor-pointer ${colorClass}`}
                                        onClick={() => handleDayClick(dayData)}
                                      />
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Heatmap */}
                  <div className="hidden sm:block">
                    <div className="flex gap-1">
                      {/* Day labels */}
                      <div className="flex flex-col gap-1 mr-2 flex-shrink-0">
                        {dayLabels.map((day, index) => (
                          <div
                            key={day}
                            className="h-2.5 lg:h-3 text-[10px] text-gray-400 flex items-center w-3 lg:w-5"
                          >
                            {index % 2 === 1 ? day : ""}
                          </div>
                        ))}
                      </div>

                      {/* Scrollable grid container */}
                      <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-1 lg:gap-2 min-w-max pb-2">
                          {monthGroups.map((monthGroup, monthIndex) => (
                            <div key={`${monthGroup.year}-${monthGroup.month}`} className="flex flex-col flex-shrink-0">
                              {/* Month weeks */}
                              <div className="flex gap-0.5 lg:gap-1">
                                {monthGroup.weeks.map((week, weekIndex) => (
                                  <div key={weekIndex} className="flex flex-col gap-0.5 lg:gap-1">
                                    {week.map((dayData, dayIndex) => {
                                      if (!dayData) {
                                        return <div key={dayIndex} className="w-2.5 h-2.5 lg:w-3 lg:h-3"></div>
                                      }

                                      const intensity = getIntensity(dayData.total)
                                      const colorClass = getHeatmapColor(intensity)

                                      return (
                                        <div
                                          key={dayIndex}
                                          className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-gray-400 ${colorClass}`}
                                          title={`${dayData.date}: ${dayData.total} problems solved`}
                                          onClick={() => handleDayClick(dayData)}
                                        />
                                      )
                                    })}
                                  </div>
                                ))}
                              </div>

                              {/* Month label */}
                              <div className="text-[9px] lg:text-[10px] text-gray-400 text-center mt-1 px-1">
                                {monthGroup.monthName}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400">
                      <span>Less</span>
                      <div className="flex gap-0.5 sm:gap-1">
                        {[0, 1, 2, 3, 4].map((intensity) => (
                          <div
                            key={intensity}
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-sm ${getHeatmapColor(intensity)}`}
                          />
                        ))}
                      </div>
                      <span>More</span>
                    </div>
                    <div className="text-xs text-gray-400">Contributions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {/* Day Details Dialog */}
      <Dialog open={showDayDetails} onOpenChange={setShowDayDetails}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-sm sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-white text-sm sm:text-base">
              {selectedDay && formatDate(selectedDay.date)}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Problems solved on this day
            </DialogDescription>
          </DialogHeader>

          {selectedDay && (
            <div className="space-y-3 sm:space-y-4">
              {/* Total Problems */}
              <div className="p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium text-sm">Total Problems</span>
                  <span className="text-xl sm:text-2xl font-bold text-white">{selectedDay.total}</span>
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Platform Breakdown
                </h4>
                {Object.entries(selectedDay.platforms).map(([platform, count]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gray-800/50 border border-gray-700 flex items-center justify-center p-1">
                        <PlatformLogo platform={platform} />
                      </div>
                      <span className="text-gray-300 font-medium text-xs sm:text-sm">{platform}</span>
                    </div>
                    <Badge
                      className={`pointer-events-none text-xs ${
                        count > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-700 text-gray-400 border-gray-600"
                      }`}
                    >
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Activity Summary */}
              {selectedDay.total > 0 && (
                <div className="p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    <span className="text-green-400 font-medium text-xs sm:text-sm">
                      Great job! You solved {selectedDay.total} {selectedDay.total === 1 ? "problem" : "problems"} on
                      this day.
                    </span>
                  </div>
                </div>
              )}

              {selectedDay.total === 0 && (
                <div className="p-3 sm:p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span className="text-gray-400 text-xs sm:text-sm">No problems solved on this day.</span>
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
