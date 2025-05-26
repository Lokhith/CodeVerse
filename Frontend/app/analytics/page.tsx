"use client"

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
import { BarChart3, Target, Activity, Award, Calendar, Brain, TrendingUp } from "lucide-react"

const weeklyData = [
  { day: "Mon", problems: 3 },
  { day: "Tue", problems: 5 },
  { day: "Wed", problems: 2 },
  { day: "Thu", problems: 8 },
  { day: "Fri", problems: 4 },
  { day: "Sat", problems: 6 },
  { day: "Sun", problems: 1 },
]

const difficultyStats = [
  {
    difficulty: "Easy",
    solved: 145,
    total: 200,
    color: "green",
  },
  {
    difficulty: "Medium",
    solved: 89,
    total: 150,
    color: "amber",
  },
  {
    difficulty: "Hard",
    solved: 23,
    total: 80,
    color: "red",
  },
]

const topicStats = [
  { topic: "Arrays", solved: 45, percentage: 78 },
  { topic: "Dynamic Programming", solved: 32, percentage: 65 },
  { topic: "Trees", solved: 28, percentage: 72 },
  { topic: "Graphs", solved: 19, percentage: 58 },
  { topic: "Strings", solved: 38, percentage: 81 },
  { topic: "Hash Tables", solved: 25, percentage: 69 },
]

export default function AnalyticsPage() {
  const maxProblems = Math.max(...weeklyData.map((d) => d.problems))

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
        <div className="flex flex-1 flex-col gap-8 p-6 bg-gray-950">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-orange-500" />
              Analytics
            </h1>
            <p className="text-gray-400 text-lg">Detailed insights into your coding performance</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Weekly Activity */}
            <Card className="col-span-2 card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Weekly Activity
                </CardTitle>
                <CardDescription className="text-gray-400">Problems solved this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-12 text-sm font-medium text-gray-300">{day.day}</div>
                        <span className="text-sm text-gray-400 font-medium">{day.problems} problems</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div
                            className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(day.problems / maxProblems) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Breakdown */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Difficulty Breakdown
                </CardTitle>
                <CardDescription className="text-gray-400">Problems by difficulty level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {difficultyStats.map((stat) => (
                  <div key={stat.difficulty} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            stat.color === "green"
                              ? "bg-green-500"
                              : stat.color === "amber"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-base font-medium text-white">{stat.difficulty}</span>
                      </div>
                      <span className="text-sm text-gray-300 font-medium">
                        {stat.solved}/{stat.total}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            stat.color === "green"
                              ? "bg-green-500"
                              : stat.color === "amber"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(stat.solved / stat.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">
                        {Math.round((stat.solved / stat.total) * 100)}% completed
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Topic Performance */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Topic Performance
                </CardTitle>
                <CardDescription className="text-gray-400">Your strength across different topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topicStats.map((topic) => (
                  <div key={topic.topic} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{topic.solved} solved</span>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {topic.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${topic.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Performance Metrics
                </CardTitle>
                <CardDescription className="text-gray-400">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-green-400">92%</div>
                    <p className="text-sm text-gray-400 mt-1">Acceptance Rate</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-orange-400">15</div>
                    <p className="text-sm text-gray-400 mt-1">Current Streak</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-blue-400">1.2k</div>
                    <p className="text-sm text-gray-400 mt-1">Total Points</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-amber-400">Top 5%</div>
                    <p className="text-sm text-gray-400 mt-1">Global Rank</p>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 flex items-center gap-2 font-medium">
                      <Target className="h-4 w-4 text-orange-500" />
                      Monthly Goal Progress
                    </span>
                    <span className="text-sm text-gray-300 font-medium">23/30</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: "76.7%" }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />7 more problems to reach your monthly goal
                  </p>
                </div>

                {/* Weekly Streak */}
                <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 flex items-center gap-2 font-medium">
                      <Activity className="h-4 w-4 text-green-500" />
                      Weekly Consistency
                    </span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">5/7 days</Badge>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: "71%" }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Great consistency this week!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Best Performance</CardTitle>
                <CardDescription className="text-gray-400">Your strongest areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-300">Arrays & Strings</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-300">Hash Tables</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">82%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-300">Two Pointers</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">78%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Improvement Areas</CardTitle>
                <CardDescription className="text-gray-400">Focus on these topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-300">Dynamic Programming</span>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">45%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-300">Graph Algorithms</span>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">52%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-sm text-gray-300">Tree Traversal</span>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">58%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Recent Achievements</CardTitle>
                <CardDescription className="text-gray-400">Latest milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Award className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">100 Problems Solved</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">15 Day Streak</p>
                      <p className="text-xs text-gray-400">Today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Expert Rating</p>
                      <p className="text-xs text-gray-400">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
