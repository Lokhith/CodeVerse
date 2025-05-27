"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Award, Target, ChevronDown } from "lucide-react"

// Rank system with XP ranges
const rankSystem = [
  {
    title: "Bronze",
    xpRange: "0 – 499",
    minXP: 0,
    maxXP: 499,
    color: "bg-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/30",
    icon: () => <span className="text-lg sm:text-xl">🥉</span>,
    description: "Starting your coding journey",
    gradient: "from-amber-700 to-amber-500",
  },
  {
    title: "Silver",
    xpRange: "500 – 999",
    minXP: 500,
    maxXP: 999,
    color: "bg-gray-400",
    textColor: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
    icon: () => <span className="text-lg sm:text-xl">🥈</span>,
    description: "Building coding fundamentals",
    gradient: "from-gray-500 to-gray-300",
  },
  {
    title: "Gold",
    xpRange: "1000 – 1999",
    minXP: 1000,
    maxXP: 1999,
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: () => <span className="text-lg sm:text-xl">🥇</span>,
    description: "Solid problem-solving skills",
    gradient: "from-yellow-600 to-yellow-400",
  },
  {
    title: "Platinum",
    xpRange: "2000 – 3499",
    minXP: 2000,
    maxXP: 3499,
    color: "bg-cyan-400",
    textColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    icon: () => <span className="text-lg sm:text-xl">💎</span>,
    description: "Advanced coding expertise",
    gradient: "from-cyan-500 to-cyan-300",
  },
  {
    title: "Diamond",
    xpRange: "3500 – 4999",
    minXP: 3500,
    maxXP: 4999,
    color: "bg-blue-400",
    textColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    icon: () => <span className="text-lg sm:text-xl">💠</span>,
    description: "Exceptional problem solver",
    gradient: "from-blue-500 to-blue-300",
  },
  {
    title: "Ace",
    xpRange: "5000 – 7499",
    minXP: 5000,
    maxXP: 7499,
    color: "bg-purple-500",
    textColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: () => <span className="text-lg sm:text-xl">⚡</span>,
    description: "Elite coding mastery",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    title: "Ace-1",
    xpRange: "7500 – 9999",
    minXP: 7500,
    maxXP: 9999,
    color: "bg-purple-600",
    textColor: "text-purple-600",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-600/30",
    icon: () => <span className="text-lg sm:text-xl">🔥</span>,
    description: "Superior competitive programmer",
    gradient: "from-purple-700 to-purple-500",
  },
  {
    title: "Ace-2",
    xpRange: "10000 – 12499",
    minXP: 10000,
    maxXP: 12499,
    color: "bg-purple-700",
    textColor: "text-purple-700",
    bgColor: "bg-purple-700/10",
    borderColor: "border-purple-700/30",
    icon: () => <span className="text-lg sm:text-xl">🎯</span>,
    description: "Master of algorithms",
    gradient: "from-purple-800 to-purple-600",
  },
  {
    title: "Conqueror",
    xpRange: "12500 – 14999",
    minXP: 12500,
    maxXP: 14999,
    color: "bg-red-500",
    textColor: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: () => <span className="text-lg sm:text-xl">🛡️</span>,
    description: "Coding battlefield champion",
    gradient: "from-red-600 to-red-400",
  },
  {
    title: "Legendary",
    xpRange: "15000 – 19999",
    minXP: 15000,
    maxXP: 19999,
    color: "bg-orange-500",
    textColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: () => <span className="text-lg sm:text-xl">👑</span>,
    description: "Legendary coding prowess",
    gradient: "from-orange-600 to-orange-400",
  },
  {
    title: "Code Verse Grandmaster",
    xpRange: "20000+",
    minXP: 20000,
    maxXP: Number.POSITIVE_INFINITY,
    color: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    textColor: "text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text",
    bgColor: "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10",
    borderColor: "border-pink-500/30",
    icon: () => <span className="text-lg sm:text-xl">✨</span>,
    description: "The ultimate coding legend",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
]

// Function to get current rank based on XP
const getCurrentRank = (xp: number) => {
  for (let i = rankSystem.length - 1; i >= 0; i--) {
    if (xp >= rankSystem[i].minXP) {
      return { rank: rankSystem[i], index: i }
    }
  }
  return { rank: rankSystem[0], index: 0 }
}

// Function to get next rank
const getNextRank = (currentIndex: number) => {
  if (currentIndex < rankSystem.length - 1) {
    return rankSystem[currentIndex + 1]
  }
  return null
}

export default function BadgesPage() {
  const [userName, setUserName] = useState("John")
  const [currentXP, setCurrentXP] = useState(2750)
  const [selectedRank, setSelectedRank] = useState<any>(null)
  const [showRankDetails, setShowRankDetails] = useState(false)

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

  const { rank: currentRank, index: currentIndex } = getCurrentRank(currentXP)
  const nextRank = getNextRank(currentIndex)
  const progressToNext = nextRank ? ((currentXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100 : 100

  const handleRankClick = (rank: any) => {
    setSelectedRank(rank)
    setShowRankDetails(true)
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
                <BreadcrumbPage className="text-gray-300 font-medium">Badges</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header with Current Rank */}
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white flex items-center justify-center gap-2 mb-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500" />
                Rank & Badges
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Track your coding journey through our ranking system
              </p>
            </div>

            {/* Current Rank Display */}
            <Card className="card-professional max-w-full sm:max-w-2xl mx-auto">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full ${currentRank.bgColor} border-2 ${currentRank.borderColor} flex items-center justify-center`}
                  >
                    <currentRank.icon />
                  </div>
                  <div className="text-center space-y-1 sm:space-y-2">
                    <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${currentRank.textColor}`}>
                      {currentRank.title}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm lg:text-base">{currentRank.description}</p>
                    <div className="flex items-center gap-1 sm:gap-2 justify-center">
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                        {currentXP.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm">XP</span>
                    </div>
                  </div>

                  {/* Progress to Next Rank */}
                  {nextRank && (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Progress to {nextRank.title}</span>
                        <span className="text-gray-300">
                          {currentXP.toLocaleString()} / {nextRank.minXP.toLocaleString()} XP
                        </span>
                      </div>
                      <Progress value={progressToNext} className="h-2 sm:h-3 bg-gray-800" />
                      <p className="text-xs text-gray-500 text-center">
                        {(nextRank.minXP - currentXP).toLocaleString()} XP needed for next rank
                      </p>
                    </div>
                  )}

                  {currentIndex === rankSystem.length - 1 && (
                    <Badge className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border-0 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                      🎉 Maximum Rank Achieved! 🎉
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* All Ranks Grid - Rectangular Badges */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
                All Ranks & Badges
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {rankSystem.map((rank, index) => {
                  const isCurrentRank = index === currentIndex
                  const isUnlocked = currentXP >= rank.minXP
                  const isNextRank = index === currentIndex + 1

                  return (
                    <Card
                      key={rank.title}
                      className={`card-professional transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                        isCurrentRank
                          ? `ring-2 ring-orange-500 ${rank.bgColor} border-orange-500/50`
                          : isUnlocked
                            ? "card-professional-hover"
                            : "opacity-60"
                      }`}
                      onClick={() => handleRankClick(rank)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Icon */}
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${rank.bgColor} border ${rank.borderColor} flex items-center justify-center flex-shrink-0 ${
                              !isUnlocked ? "grayscale" : ""
                            }`}
                          >
                            <rank.icon />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3
                                className={`text-sm sm:text-base font-bold ${isUnlocked ? rank.textColor : "text-gray-500"} truncate`}
                              >
                                {rank.title}
                              </h3>
                              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-xs sm:text-sm text-gray-400">{rank.xpRange}</p>

                              {/* Status Badge */}
                              <div className="flex-shrink-0">
                                {isCurrentRank && (
                                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-0.5">
                                    Current
                                  </Badge>
                                )}
                                {isNextRank && !isUnlocked && (
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
                                    Next
                                  </Badge>
                                )}
                                {isUnlocked && !isCurrentRank && index < currentIndex && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-0.5">
                                    Unlocked
                                  </Badge>
                                )}
                                {!isUnlocked && !isNextRank && (
                                  <Badge className="bg-gray-700 text-gray-400 border-gray-600 text-xs px-2 py-0.5">
                                    Locked
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* XP Progress for current/next rank */}
                            {(isCurrentRank || isNextRank) && (
                              <div className="mt-2">
                                {isCurrentRank && nextRank && (
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-400">Progress</span>
                                      <span className="text-gray-300">{Math.round(progressToNext)}%</span>
                                    </div>
                                    <Progress value={progressToNext} className="h-1.5 bg-gray-800" />
                                  </div>
                                )}
                                {isNextRank && (
                                  <div className="text-xs text-orange-400 mt-1">
                                    {(rank.minXP - currentXP).toLocaleString()} XP needed
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* XP Sources Info */}
            <Card className="card-professional">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  How to Earn XP
                </CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Complete coding challenges to earn experience points and climb the ranks
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-400">+50</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Easy Problem</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400">+75</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Medium Problem</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-400">+100</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Hard Problem</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 lg:p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">+200</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Contest Win</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {/* Rank Details Dialog */}
      <Dialog open={showRankDetails} onOpenChange={setShowRankDetails}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-sm sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selectedRank && (
                <>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${selectedRank.bgColor} border-2 ${selectedRank.borderColor} flex items-center justify-center`}
                  >
                    <selectedRank.icon />
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${selectedRank.textColor}`}>{selectedRank.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{selectedRank.xpRange} XP</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">{selectedRank?.description}</DialogDescription>
          </DialogHeader>

          {selectedRank && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">XP Range:</span>
                    <span className="text-white font-medium">{selectedRank.xpRange}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Status:</span>
                    <span className="text-white font-medium">
                      {currentXP >= selectedRank.minXP ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                  {currentXP < selectedRank.minXP && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">XP Needed:</span>
                      <span className="text-orange-400 font-medium">
                        {(selectedRank.minXP - currentXP).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Requirements</h4>
                <p className="text-xs text-gray-400">
                  Reach {selectedRank.minXP.toLocaleString()} XP by solving coding problems and participating in
                  contests.
                </p>
              </div>

              {/* Benefits */}
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Benefits</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Exclusive rank badge</li>
                  <li>• Profile showcase</li>
                  <li>• Community recognition</li>
                  {selectedRank.minXP >= 5000 && <li>• Special privileges</li>}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
