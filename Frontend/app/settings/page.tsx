"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Settings, User, Mail, Lock, Eye, EyeOff, Save, AlertCircle, CheckCircle, Shield, Trash2 } from "lucide-react"

interface FormErrors {
  username?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

interface SuccessMessages {
  username?: string
  email?: string
  password?: string
}

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState({ username: false, email: false, password: false })
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessages, setSuccessMessages] = useState<SuccessMessages>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe_coder",
    email: "john@example.com",
  })

  const [formData, setFormData] = useState({
    username: userData.username,
    email: userData.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Load user data from localStorage
    const getUserData = () => {
      try {
        const storedUserData = localStorage.getItem("userData")
        if (storedUserData) {
          const user = JSON.parse(storedUserData)
          const updatedData = {
            firstName: user.firstName || "John",
            lastName: user.lastName || "Doe",
            username: user.username || "johndoe_coder",
            email: user.email || "john@example.com",
          }
          setUserData(updatedData)
          setFormData((prev) => ({
            ...prev,
            username: updatedData.username,
            email: updatedData.email,
          }))
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    getUserData()
  }, [])

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return "Username is required"
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters"
    }
    if (username.trim().length > 30) {
      return "Username must be less than 30 characters"
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return "Username can only contain letters, numbers, and underscores"
    }
    return null
  }

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address"
    }
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    // Clear success message when user starts editing
    if (successMessages[name as keyof SuccessMessages]) {
      setSuccessMessages((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleUsernameUpdate = async () => {
    const usernameError = validateUsername(formData.username)
    if (usernameError) {
      setErrors({ username: usernameError })
      return
    }

    if (formData.username === userData.username) {
      setErrors({ username: "New username must be different from current username" })
      return
    }

    setIsLoading((prev) => ({ ...prev, username: true }))
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock username existence check
      const existingUsernames = ["admin", "testuser", "johndoe123", "codemaster"]
      if (existingUsernames.includes(formData.username.toLowerCase())) {
        setErrors({ username: "This username is already taken" })
        setIsLoading((prev) => ({ ...prev, username: false }))
        return
      }

      // Update user data
      const updatedUserData = { ...userData, username: formData.username }
      setUserData(updatedUserData)
      localStorage.setItem("userData", JSON.stringify(updatedUserData))

      setSuccessMessages({ username: "Username updated successfully!" })

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent("userDataUpdated", { detail: { userData: updatedUserData } }))
    } catch (error) {
      setErrors({ username: "Failed to update username. Please try again." })
    } finally {
      setIsLoading((prev) => ({ ...prev, username: false }))
    }
  }

  const handleEmailUpdate = async () => {
    const emailError = validateEmail(formData.email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }

    if (formData.email === userData.email) {
      setErrors({ email: "New email must be different from current email" })
      return
    }

    setIsLoading((prev) => ({ ...prev, email: true }))
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock email existence check
      const existingEmails = ["existing@example.com", "test@test.com", "admin@codeverse.com"]
      if (existingEmails.includes(formData.email.toLowerCase())) {
        setErrors({ email: "An account with this email already exists" })
        setIsLoading((prev) => ({ ...prev, email: false }))
        return
      }

      // Update user data
      const updatedUserData = { ...userData, email: formData.email }
      setUserData(updatedUserData)
      localStorage.setItem("userData", JSON.stringify(updatedUserData))

      setSuccessMessages({ email: "Email updated successfully!" })

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent("userDataUpdated", { detail: { userData: updatedUserData } }))
    } catch (error) {
      setErrors({ email: "Failed to update email. Please try again." })
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }))
    }
  }

  const handlePasswordUpdate = async () => {
    const newErrors: FormErrors = {}

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    // Validate new password
    const newPasswordError = validatePassword(formData.newPassword)
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Check if new password is different from current
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading((prev) => ({ ...prev, password: true }))
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock current password verification
      const correctCurrentPassword = "password123"
      if (formData.currentPassword !== correctCurrentPassword) {
        setErrors({ currentPassword: "Current password is incorrect" })
        setIsLoading((prev) => ({ ...prev, password: false }))
        return
      }

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSuccessMessages({ password: "Password updated successfully!" })
    } catch (error) {
      setErrors({ general: "Failed to update password. Please try again." })
    } finally {
      setIsLoading((prev) => ({ ...prev, password: false }))
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear all user data
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
      localStorage.removeItem("userAvatar")

      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to delete account:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
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
                <BreadcrumbPage className="text-gray-300 font-medium">Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 mb-2">
                  <Settings className="h-6 w-6 lg:h-8 lg:w-8 text-orange-500" />
                  Settings
                </h1>
                <p className="text-gray-400 text-base lg:text-lg">Manage your account settings and preferences</p>
              </div>
            </div>

            {/* Change Username */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Change Username
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your username. This will be visible to other users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {successMessages.username && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-400">{successMessages.username}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="current-username" className="text-gray-300">
                    Current Username
                  </Label>
                  <Input
                    id="current-username"
                    value={userData.username}
                    disabled
                    className="bg-gray-800 border-gray-700 text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    New Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter new username"
                    className={`bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                      errors.username ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.username}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUsernameUpdate}
                  disabled={isLoading.username || formData.username === userData.username}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading.username ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Username
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Change Email */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-500" />
                  Change Email
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your email address. You'll need to verify the new email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {successMessages.email && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-400">{successMessages.email}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="current-email" className="text-gray-300">
                    Current Email
                  </Label>
                  <Input
                    id="current-email"
                    value={userData.email}
                    disabled
                    className="bg-gray-800 border-gray-700 text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    New Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter new email address"
                    className={`bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-green-500/20 ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleEmailUpdate}
                  disabled={isLoading.email || formData.email === userData.email}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading.email ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-500" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {successMessages.password && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-400">{successMessages.password}</AlertDescription>
                  </Alert>
                )}

                {errors.general && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-400">{errors.general}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-300">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className={`bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 pr-10 ${
                        errors.currentPassword ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-purple-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-300">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className={`bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 pr-10 ${
                        errors.newPassword ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-purple-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className={`bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 pr-10 ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-purple-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handlePasswordUpdate}
                  disabled={
                    isLoading.password ||
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    !formData.confirmPassword
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading.password ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="card-professional border-red-500/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Irreversible and destructive actions for your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain. This action will:
                  </p>
                  <ul className="text-gray-400 text-sm space-y-1 mb-4 ml-4">
                    <li>• Permanently delete your profile and all associated data</li>
                    <li>• Remove all your connected platform accounts</li>
                    <li>• Delete your coding statistics and achievements</li>
                    <li>• Cancel any active subscriptions</li>
                  </ul>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your account and remove all your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}
