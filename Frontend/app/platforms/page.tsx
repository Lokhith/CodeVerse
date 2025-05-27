"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { CheckCircle, XCircle, LinkIcon, RefreshCw, Activity, Globe } from "lucide-react"

const platforms = [
  {
    id: "leetcode",
    name: "LeetCode",
    description: "Practice coding problems and prepare for technical interviews",
    connected: true,
    username: "john_doe_123",
    lastSync: "2 hours ago",
    logo: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
        <path
          d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"
          className="text-orange-500"
        />
      </svg>
    ),
  },
  {
    id: "codechef",
    name: "CodeChef",
    description: "Competitive programming platform with monthly contests",
    connected: true,
    username: "johndoe",
    lastSync: "5 hours ago",
    logo: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
        <path
          d="M11.257.004c-.37 0-.74.006-1.108.02C4.764.147.53 3.97.004 9.279c-.571 5.748 3.466 11.15 9.214 11.721 5.748.571 11.15-3.466 11.721-9.214.571-5.748-3.466-11.15-9.214-11.721-.37-.037-.74-.055-1.108-.061zm-.001 1.647c.31 0 .62.005.928.016 4.84.394 8.698 4.46 8.304 9.3-.394 4.84-4.46 8.698-9.3 8.304-4.84-.394-8.698-4.46-8.304-9.3.394-4.84 4.46-8.698 9.3-8.304.024-.001.048-.016.072-.016zm.001 2.372c-3.616 0-6.549 2.933-6.549 6.549s2.933 6.549 6.549 6.549 6.549-2.933 6.549-6.549-2.933-6.549-6.549-6.549z"
          className="text-amber-500"
        />
      </svg>
    ),
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    description: "Coding challenges and skill assessments",
    connected: true,
    username: "john.doe",
    lastSync: "1 day ago",
    logo: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
        <path
          d="M12 0c1.285 0 9.75 4.886 10.392 6 .642 1.114.642 10.886 0 12C21.75 19.114 13.285 24 12 24s-9.75-4.886-10.392-6c-.642-1.114-.642-10.886 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.141-.115-.258-.258-.258H8.963c-.141 0-.258.115-.258.258v9.886c0 .141.115.258.258.258h.742c.141 0 .258-.115.258-.258v-4.629h4.074v4.629c0 .141.115.258.258.258h.742c.141 0 .258-.115.258-.258V7.057c0-.141-.115-.258-.258-.258h-.742z"
          className="text-green-500"
        />
      </svg>
    ),
  },
  {
    id: "geeksforgeeks",
    name: "GeeksforGeeks",
    description: "Programming tutorials and practice problems",
    connected: false,
    username: "",
    lastSync: "Never",
    logo: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
        <path
          d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.565 4.677 4.677 0 0 1-1.42.197 4.522 4.522 0 0 1-1.746-.35 4.35 4.35 0 0 1-1.428-.992 4.647 4.647 0 0 1-.955-1.51 5.006 5.006 0 0 1-.349-1.872 5.789 5.789 0 0 1 .35-2.017 4.651 4.651 0 0 1 .955-1.51 4.35 4.35 0 0 1 1.428-.992 4.522 4.522 0 0 1 1.746-.35c.493 0 .98.07 1.42.197.44.127.835.308 1.104.565.231.213.422.465.565.745.143.28.197.565.197.85 0 .143-.028.28-.07.412a1.07 1.07 0 0 1-.197.334c-.084.098-.197.175-.322.224a1.13 1.13 0 0 1-.412.07c-.14 0-.28-.028-.412-.07a1.13 1.13 0 0 1-.322-.224 1.07 1.07 0 0 1-.197-.334 1.13 1.13 0 0 1-.07-.412c0-.098.014-.197.042-.294.028-.098.07-.189.126-.273.056-.084.126-.154.21-.21.084-.056.182-.098.294-.126.112-.028.224-.042.322-.042.098 0 .197.014.294.042.098.028.189.07.273.126.084.056.154.126.21.21.056.084.098.175.126.273.028.098.042.196.042.294 0 .285-.054.57-.197.85z"
          className="text-gray-400"
        />
      </svg>
    ),
  },
]

export default function PlatformsPage() {
  const [platformData, setPlatformData] = useState(platforms)
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [newUsername, setNewUsername] = useState("")

  const handleConnect = (platformId: string) => {
    if (newUsername.trim()) {
      setPlatformData((prev) =>
        prev.map((platform) =>
          platform.id === platformId
            ? { ...platform, connected: true, username: newUsername, lastSync: "Just now" }
            : platform,
        ),
      )
      setEditingPlatform(null)
      setNewUsername("")
    }
  }

  const handleDisconnect = (platformId: string) => {
    setPlatformData((prev) =>
      prev.map((platform) =>
        platform.id === platformId ? { ...platform, connected: false, username: "", lastSync: "Never" } : platform,
      ),
    )
  }

  const handleSync = (platformId: string) => {
    setPlatformData((prev) =>
      prev.map((platform) => (platform.id === platformId ? { ...platform, lastSync: "Just now" } : platform)),
    )
  }

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
                <BreadcrumbPage className="text-gray-300 font-medium">Platform Integration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-6 sm:gap-8 p-4 sm:p-6 bg-gray-950">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              Platform Integration
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Connect your coding platform accounts to unify your progress
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {platformData.map((platform) => (
              <Card key={platform.id} className="card-professional card-professional-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center p-1.5">
                        <platform.logo />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">{platform.name}</CardTitle>
                        <CardDescription className="text-gray-400">{platform.description}</CardDescription>
                      </div>
                    </div>
                    {platform.connected ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platform.connected ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="text-sm text-gray-400 font-medium">Username:</span>
                        <Badge className="bg-gray-700 text-gray-200 border-gray-600">{platform.username}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="text-sm text-gray-400 font-medium">Last sync:</span>
                        <span className="text-sm text-green-400 flex items-center gap-1 font-medium">
                          <Activity className="h-3 w-3" />
                          {platform.lastSync}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(platform.id)}
                          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(platform.id)}
                          className="bg-red-600 hover:bg-red-700 border-red-600"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingPlatform === platform.id ? (
                        <div className="space-y-3">
                          <Label htmlFor={`username-${platform.id}`} className="text-gray-300 font-medium">
                            Username
                          </Label>
                          <Input
                            id={`username-${platform.id}`}
                            placeholder={`Enter your ${platform.name} username`}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                          />
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              onClick={() => handleConnect(platform.id)}
                              disabled={!newUsername.trim()}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            >
                              Connect
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingPlatform(null)
                                setNewUsername("")
                              }}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setEditingPlatform(platform.id)}
                          className="w-full font-semibold py-3 shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Connect {platform.name}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Integration Status
              </CardTitle>
              <CardDescription className="text-gray-400">Overview of your connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-bold text-green-400">
                    {platformData.filter((p) => p.connected).length}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Connected</p>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-bold text-gray-400">
                    {platformData.filter((p) => !p.connected).length}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Not Connected</p>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-bold text-blue-400">
                    {platformData.filter((p) => p.lastSync.includes("hour") || p.lastSync === "Just now").length}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Recently Synced</p>
                </div>
                <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="text-2xl font-bold text-orange-400">
                    {Math.round((platformData.filter((p) => p.connected).length / platformData.length) * 100)}%
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Integration Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
