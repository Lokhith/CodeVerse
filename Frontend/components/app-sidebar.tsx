"use client"

import { Calendar, Home, Settings, User, Trophy, BarChart3, LinkIcon, LogOut, Award } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Badges",
    url: "/badges",
    icon: Award,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
]

const platformItems = [
  {
    title: "Link Platforms",
    url: "/platforms",
    icon: LinkIcon,
  },
  {
    title: "Profile Settings",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    initials: "JD",
  })

  useEffect(() => {
    // Get user data from localStorage or API
    const getUserData = () => {
      try {
        const authToken = localStorage.getItem("authToken")
        const storedUserData = localStorage.getItem("userData")

        if (storedUserData) {
          const user = JSON.parse(storedUserData)
          setUserData({
            firstName: user.firstName || "John",
            lastName: user.lastName || "Doe",
            email: user.email || "john@example.com",
            initials: `${user.firstName?.[0] || "J"}${user.lastName?.[0] || "D"}`,
          })
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    getUserData()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // Simulate logout API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear authentication token
      localStorage.removeItem("authToken")

      // Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  return (
    <>
      <Sidebar className="bg-gray-950 border-r border-gray-800">
        <SidebarHeader className="border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="grid flex-1 text-left">
              <span className="text-lg font-bold text-white">CodeVerse</span>
              <span className="text-xs text-gray-400">Unified Dashboard</span>
            </div>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
              Pro
            </Badge>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-gray-950">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 font-medium text-xs uppercase tracking-wider px-4">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={`mx-2 rounded-lg transition-all duration-200 ${
                        pathname === item.url
                          ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 font-medium text-xs uppercase tracking-wider px-4">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {platformItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={`mx-2 rounded-lg transition-all duration-200 ${
                        pathname === item.url
                          ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-gray-950 border-t border-gray-800">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="mx-2 hover:bg-gray-800 rounded-lg data-[state=open]:bg-gray-800">
                    <Avatar className="h-8 w-8 ring-2 ring-orange-500/30">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-sm">
                        {userData.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-gray-200 font-medium text-sm">
                        {userData.firstName} {userData.lastName}
                      </span>
                      <span className="text-xs text-gray-400">{userData.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-56 bg-gray-900 border-gray-700">
                  <DropdownMenuItem asChild className="text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Sign out of CodeVerse?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You will be signed out of your account and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              disabled={isLoggingOut}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
