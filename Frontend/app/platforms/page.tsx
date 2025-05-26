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
    color: "orange",
  },
  {
    id: "codechef",
    name: "CodeChef",
    description: "Competitive programming platform with monthly contests",
    connected: true,
    username: "johndoe",
    lastSync: "5 hours ago",
    color: "amber",
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    description: "Coding challenges and skill assessments",
    connected: true,
    username: "john.doe",
    lastSync: "1 day ago",
    color: "green",
  },
  {
    id: "geeksforgeeks",
    name: "GeeksforGeeks",
    description: "Programming tutorials and practice problems",
    connected: false,
    username: "",
    lastSync: "Never",
    color: "gray",
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
                      <div
                        className={`w-4 h-4 rounded-full ${
                          platform.color === "orange"
                            ? "bg-orange-500"
                            : platform.color === "amber"
                              ? "bg-amber-500"
                              : platform.color === "green"
                                ? "bg-green-500"
                                : "bg-gray-500"
                        }`}
                      />
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
                          className={`w-full font-semibold py-3 shadow-lg ${
                            platform.color === "orange"
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                              : platform.color === "amber"
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                                : platform.color === "green"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                  : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                          } text-white`}
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
