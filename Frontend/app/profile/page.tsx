"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  Edit3,
  MapPin,
  Calendar,
  Star,
  Flame,
  Trophy,
  ExternalLink,
  Camera,
  Save,
  X,
  Github,
  Globe,
  Upload,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

// Rank system
const rankSystem = [
  {
    title: "Bronze",
    minXP: 0,
    maxXP: 499,
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/30",
    icon: () => <span>🥉</span>,
  },
  {
    title: "Silver",
    minXP: 500,
    maxXP: 999,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
    icon: () => <span>🥈</span>,
  },
  {
    title: "Gold",
    minXP: 1000,
    maxXP: 1999,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: () => <span>🥇</span>,
  },
  {
    title: "Platinum",
    minXP: 2000,
    maxXP: 3499,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    icon: () => <span>💎</span>,
  },
  {
    title: "Diamond",
    minXP: 3500,
    maxXP: 4999,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    icon: () => <span>💠</span>,
  },
  {
    title: "Ace",
    minXP: 5000,
    maxXP: 7499,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: () => <span>⚡</span>,
  },
  {
    title: "Ace-1",
    minXP: 7500,
    maxXP: 9999,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-600/30",
    icon: () => <span>🔥</span>,
  },
  {
    title: "Ace-2",
    minXP: 10000,
    maxXP: 12499,
    color: "text-purple-700",
    bgColor: "bg-purple-700/10",
    borderColor: "border-purple-700/30",
    icon: () => <span>🎯</span>,
  },
  {
    title: "Conqueror",
    minXP: 12500,
    maxXP: 14999,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: () => <span>🛡️</span>,
  },
  {
    title: "Legendary",
    minXP: 15000,
    maxXP: 19999,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: () => <span>👑</span>,
  },
  {
    title: "Code Verse Grandmaster",
    minXP: 20000,
    maxXP: Number.POSITIVE_INFINITY,
    color: "text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text",
    bgColor: "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10",
    borderColor: "border-pink-500/30",
    icon: () => <span>✨</span>,
  },
]

// Platform logos component
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
    case "GitHub":
      return <Github className={`${size} text-gray-300`} />
    default:
      return <Globe className={`${size} text-gray-400`} />
  }
}

const getCurrentRank = (xp: number) => {
  for (let i = rankSystem.length - 1; i >= 0; i--) {
    if (xp >= rankSystem[i].minXP) {
      return { rank: rankSystem[i], index: i }
    }
  }
  return { rank: rankSystem[0], index: 0 }
}

const getNextRank = (currentIndex: number) => {
  if (currentIndex < rankSystem.length - 1) {
    return rankSystem[currentIndex + 1]
  }
  return null
}

// Image cropper component with circular selection
const ImageCropper = ({
  imageSrc,
  onCrop,
  onCancel,
}: {
  imageSrc: string
  onCrop: (croppedImage: string) => void
  onCancel: () => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 })
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImageLoaded(true)
      // Center the crop area when image loads
      const containerSize = Math.min(400, 300)
      const cropSize = Math.min(containerSize * 0.6, 200)
      setCrop({
        x: (containerSize - cropSize) / 2,
        y: (containerSize - cropSize) / 2,
        size: cropSize,
      })
    }
    img.src = imageSrc
    if (imageRef.current) {
      imageRef.current = img
    }
  }, [imageSrc])

  const handleCrop = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 200 // Output size
    canvas.width = size
    canvas.height = size

    // Create circular clipping path
    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()

    // Calculate scaling and positioning
    const img = imageRef.current
    const imgAspect = img.width / img.height
    const containerSize = 400

    let drawWidth = containerSize * scale
    let drawHeight = containerSize * scale

    if (imgAspect > 1) {
      drawHeight = drawWidth / imgAspect
    } else {
      drawWidth = drawHeight * imgAspect
    }

    const sourceX = (crop.x / containerSize) * drawWidth
    const sourceY = (crop.y / containerSize) * drawHeight
    const sourceSize = (crop.size / containerSize) * Math.min(drawWidth, drawHeight)

    ctx.translate(size / 2, size / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.drawImage(
      img,
      sourceX - drawWidth / 2,
      sourceY - drawHeight / 2,
      sourceSize,
      sourceSize,
      -size / 2,
      -size / 2,
      size,
      size,
    )
    ctx.restore()

    const croppedImage = canvas.toDataURL("image/jpeg", 0.9)
    onCrop(croppedImage)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top
    const startCrop = { ...crop }

    const handleMouseMove = (e: MouseEvent) => {
      const newX = startCrop.x + (e.clientX - rect.left - startX)
      const newY = startCrop.y + (e.clientY - rect.top - startY)

      // Keep crop within bounds
      const maxX = 400 - crop.size
      const maxY = 300 - crop.size

      setCrop({
        ...crop,
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-800 rounded-lg p-4 flex items-center justify-center overflow-hidden">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden" style={{ width: 400, height: 300 }}>
          <img
            ref={imageRef}
            src={imageSrc || "/placeholder.svg"}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
          />

          {/* Overlay with circular crop area */}
          <div className="absolute inset-0 bg-black bg-opacity-50">
            <div
              className="absolute border-2 border-white rounded-full shadow-lg cursor-move"
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.size,
                height: crop.size,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-0 border-2 border-dashed border-white border-opacity-50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label className="text-gray-300 min-w-[60px]">Size:</Label>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min="100"
              max="250"
              step="10"
              value={crop.size}
              onChange={(e) => setCrop((prev) => ({ ...prev, size: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-gray-300 min-w-[40px] text-sm">{crop.size}px</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label className="text-gray-300 min-w-[60px]">Zoom:</Label>
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.min(3, scale + 0.1))}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Label className="text-gray-300 min-w-[60px]">Rotate:</Label>
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation(rotation - 90)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-gray-300 min-w-[40px] text-sm">{rotation}°</span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <Button onClick={handleCrop} className="bg-green-600 hover:bg-green-700 text-white flex-1">
          <Save className="h-4 w-4 mr-2" />
          Apply Changes
        </Button>
        <Button onClick={onCancel} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 flex-1">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe_coder",
    email: "john@example.com",
    bio: "Passionate software developer with expertise in full-stack development. Love solving complex problems and building innovative solutions.",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    avatar: "/placeholder.svg?height=120&width=120",
  })

  const [editData, setEditData] = useState(profileData)
  const [currentXP] = useState(2750)
  const [currentStreak] = useState(15)
  const [longestStreak] = useState(42)

  // Connected platforms data
  const [connectedPlatforms] = useState([
    {
      name: "LeetCode",
      username: "john_doe_123",
      profileUrl: "https://leetcode.com/john_doe_123",
      connected: true,
    },
    {
      name: "CodeChef",
      username: "johndoe",
      profileUrl: "https://codechef.com/users/johndoe",
      connected: true,
    },
    {
      name: "HackerRank",
      username: "john.doe",
      profileUrl: "https://hackerrank.com/john.doe",
      connected: true,
    },
    {
      name: "GitHub",
      username: "johndoe-dev",
      profileUrl: "https://github.com/johndoe-dev",
      connected: true,
    },
    {
      name: "GeeksforGeeks",
      username: "",
      profileUrl: "",
      connected: false,
    },
  ])

  const { rank: currentRank, index: currentIndex } = getCurrentRank(currentXP)
  const nextRank = getNextRank(currentIndex)
  const progressToNext = nextRank ? ((currentXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100 : 100

  const handleCropComplete = (croppedImage: string) => {
    setProfileData((prev) => ({ ...prev, avatar: croppedImage }))
    setEditData((prev) => ({ ...prev, avatar: croppedImage }))

    // Save avatar to localStorage for persistence across the app
    localStorage.setItem("userAvatar", croppedImage)

    setShowCropper(false)
    setSelectedImage(null)
    setShowAvatarDialog(false)
  }

  useEffect(() => {
    // Load user data from localStorage
    const getUserData = () => {
      try {
        const storedUserData = localStorage.getItem("userData")
        const storedAvatar = localStorage.getItem("userAvatar")

        if (storedUserData) {
          const user = JSON.parse(storedUserData)
          const updatedData = {
            ...profileData,
            firstName: user.firstName || "John",
            lastName: user.lastName || "Doe",
            username: user.username || "johndoe_coder",
            email: user.email || "john@example.com",
            avatar: storedAvatar || "/placeholder.svg?height=120&width=120",
          }
          setProfileData(updatedData)
          setEditData(updatedData)
        } else if (storedAvatar) {
          // If only avatar is stored, update just the avatar
          setProfileData((prev) => ({ ...prev, avatar: storedAvatar }))
          setEditData((prev) => ({ ...prev, avatar: storedAvatar }))
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    getUserData()
  }, [])

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)

    // Update localStorage
    const userData = {
      firstName: editData.firstName,
      lastName: editData.lastName,
      username: editData.username,
      email: editData.email,
    }
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setSelectedImage(null)
  }

  const initials = `${profileData.firstName[0]}${profileData.lastName[0]}`

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
                <BreadcrumbPage className="text-gray-300 font-medium">Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-6xl p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 mb-2">
                  <User className="h-6 w-6 lg:h-8 lg:w-8 text-orange-500" />
                  Profile
                </h1>
                <p className="text-gray-400 text-base lg:text-lg">Manage your profile and coding journey</p>
              </div>

              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <Card className="lg:col-span-2 card-professional">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Basic Information</CardTitle>
                  <CardDescription className="text-gray-400">Your personal details and bio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar and Name */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-4 ring-orange-500/30">
                        <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600 p-0"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Change Profile Picture</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Upload a new profile picture and crop it to your preference
                              </DialogDescription>
                            </DialogHeader>

                            {!selectedImage && !showCropper ? (
                              <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-400 mb-4">Click to upload or drag and drop</p>
                                  <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                  >
                                    Choose Image
                                  </Button>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                  />
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                  Supported formats: JPG, PNG, GIF (max 5MB)
                                </p>
                              </div>
                            ) : showCropper && selectedImage ? (
                              <ImageCropper
                                imageSrc={selectedImage}
                                onCrop={handleCropComplete}
                                onCancel={handleCropCancel}
                              />
                            ) : null}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-gray-300">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={editData.firstName}
                              onChange={(e) => setEditData((prev) => ({ ...prev, firstName: e.target.value }))}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-300">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={editData.lastName}
                              onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {profileData.firstName} {profileData.lastName}
                          </h2>
                          <p className="text-orange-400 font-medium">@{profileData.username}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Username and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Username</Label>
                      {isEditing ? (
                        <Input
                          value={editData.username}
                          onChange={(e) => setEditData((prev) => ({ ...prev, username: e.target.value }))}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">@{profileData.username}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Email</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label className="text-gray-300">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={editData.bio}
                        onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Location and Join Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Location</Label>
                      {isEditing ? (
                        <Input
                          value={editData.location}
                          onChange={(e) => setEditData((prev) => ({ ...prev, location: e.target.value }))}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="text-white font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {profileData.location}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Member Since</Label>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {profileData.joinDate}
                      </p>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4 border-t border-gray-800">
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Rank */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-500" />
                    Current Rank
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-3">
                    <div
                      className={`w-16 h-16 rounded-full ${currentRank.bgColor} border-2 ${currentRank.borderColor} flex items-center justify-center mx-auto`}
                    >
                      <currentRank.icon />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${currentRank.color}`}>{currentRank.title}</h3>
                      <div className="flex items-center gap-2 justify-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-2xl font-bold text-white">{currentXP.toLocaleString()}</span>
                        <span className="text-gray-400">XP</span>
                      </div>
                    </div>
                  </div>

                  {nextRank && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress to {nextRank.title}</span>
                        <span className="text-gray-300">{Math.round(progressToNext)}%</span>
                      </div>
                      <Progress value={progressToNext} className="h-2 bg-gray-800" />
                      <p className="text-xs text-gray-500 text-center">
                        {(nextRank.minXP - currentXP).toLocaleString()} XP needed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Streak Info */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  Streak Information
                </CardTitle>
                <CardDescription className="text-gray-400">Your coding consistency and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg">
                    <Flame className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{currentStreak}</div>
                    <p className="text-red-400 font-medium">Current Streak</p>
                    <p className="text-gray-400 text-sm mt-1">Days in a row</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                    <Trophy className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-white mb-2">{longestStreak}</div>
                    <p className="text-purple-400 font-medium">Longest Streak</p>
                    <p className="text-gray-400 text-sm mt-1">Personal best</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coding Platform Links */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Coding Platform Links</CardTitle>
                <CardDescription className="text-gray-400">Your connected coding platform accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedPlatforms.map((platform) => (
                    <div
                      key={platform.name}
                      className={`p-4 rounded-lg border transition-all ${
                        platform.connected
                          ? "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                          : "bg-gray-800/30 border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center p-1.5">
                          <PlatformLogo platform={platform.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white">{platform.name}</h3>
                          {platform.connected ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              Connected
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-700 text-gray-400 border-gray-600 text-xs">Not Connected</Badge>
                          )}
                        </div>
                      </div>

                      {platform.connected ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-medium">@{platform.username}</p>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 text-xs"
                          >
                            <a href={platform.profileUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-2" />
                              View Profile
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gray-700 text-gray-400 hover:bg-gray-800 text-xs"
                          disabled
                        >
                          Not Connected
                        </Button>
                      )}
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
