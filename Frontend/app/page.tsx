"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  BarChart3,
  LinkIcon,
  Target,
  ArrowRight,
  Code,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
} from "lucide-react"

// Custom hook for animated counter
function useAnimatedCounter(targetValue: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * targetValue)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, targetValue, duration])

  return { count, ref }
}

// Counter component
function AnimatedCounter({
  targetValue,
  suffix = "",
  duration = 2000,
}: {
  targetValue: number
  suffix?: string
  duration?: number
}) {
  const { count, ref } = useAnimatedCounter(targetValue, duration)

  return (
    <div ref={ref}>
      <h3 className="text-3xl font-bold text-white">
        {count.toLocaleString()}
        {suffix}
      </h3>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <Link className="flex items-center justify-center" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-white">CodeVerse</span>
        </Link>
        <nav className="ml-auto hidden sm:flex gap-4 lg:gap-6">
          <Link className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-300 hover:text-orange-500 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link
            className="text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
            href="/auth/login"
          >
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-16 lg:py-20 xl:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,138,0,0.1),transparent_70%)]"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-6">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2 font-medium">
                  <Star className="h-4 w-4 mr-2" />
                  Unified Coding Dashboard
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white">
                  Unify Your <span className="professional-gradient">Coding Journey</span>
                </h1>
                <p className="mx-auto max-w-[90%] sm:max-w-[700px] text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed px-4 sm:px-0">
                  Connect all your coding platforms in one place. Track progress, analyze performance, and showcase your
                  competitive programming achievements across LeetCode, CodeChef, HackerRank, and more.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 sm:px-8 py-3 h-12 shadow-xl w-full sm:w-auto"
                >
                  <Link href="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-6 sm:px-8 py-3 h-12 w-full sm:w-auto"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4 text-green-500" />
                <span>Trusted by 1,000+ developers worldwide</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-8 md:py-16 lg:py-20 bg-gray-900/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                Everything you need to track your coding progress
              </h2>
              <p className="max-w-[800px] text-gray-400 text-lg leading-relaxed">
                CodeVerse brings together all your coding achievements in one unified, professional dashboard
              </p>
            </div>
            <div className="grid max-w-6xl mx-auto gap-8 lg:grid-cols-3">
              <Card className="card-professional card-professional-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                    <LinkIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <CardTitle className="text-white text-xl">Multi-Platform Integration</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Connect your accounts from LeetCode, CodeChef, HackerRank, GeeksforGeeks, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Real-time data synchronization
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Secure API connections
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Automatic profile updates
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="card-professional card-professional-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-white text-xl">Advanced Analytics</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    Get detailed insights into your coding performance and progress trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Performance metrics & trends
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Topic-wise analysis
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Progress tracking & goals
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="card-professional card-professional-hover">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-amber-500" />
                  </div>
                  <CardTitle className="text-white text-xl">Unified Dashboard</CardTitle>
                  <CardDescription className="text-gray-400 text-base">
                    View all your coding achievements and statistics in one beautiful interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Consolidated statistics
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Activity heatmaps
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      Achievement tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Counters */}
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <AnimatedCounter targetValue={20000} suffix="+" duration={2500} />
                  <p className="text-gray-400 font-medium">Problems Tracked</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <AnimatedCounter targetValue={1000} suffix="+" duration={2000} />
                  <p className="text-gray-400 font-medium">Active Users</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <AnimatedCounter targetValue={4} suffix="+" duration={1500} />
                  <p className="text-gray-400 font-medium">Platforms Supported</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-8 md:py-16 lg:py-20 bg-gray-900/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                  Ready to unify your coding journey?
                </h2>
                <p className="max-w-[600px] text-gray-400 text-lg leading-relaxed">
                  Join thousands of developers who are already tracking their progress with CodeVerse
                </p>
              </div>
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3 h-12 shadow-xl"
              >
                <Link href="/auth/signup">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-gray-900/50">
        <p className="text-xs text-gray-400">© 2024 CodeVerse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-gray-400 hover:text-orange-500 transition-colors" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs text-gray-400 hover:text-orange-500 transition-colors" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
