"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Plus, Target, Clock, CheckCircle2, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: Date
}

interface DayTasks {
  [dateKey: string]: Task[]
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showDayTasksDialog, setShowDayTasksDialog] = useState(false)
  const [tasks, setTasks] = useState<DayTasks>({})
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("calendarTasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        // Convert date strings back to Date objects
        const convertedTasks: DayTasks = {}
        Object.keys(parsedTasks).forEach((dateKey) => {
          convertedTasks[dateKey] = parsedTasks[dateKey].map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }))
        })
        setTasks(convertedTasks)
      } catch (error) {
        console.error("Error loading tasks:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("calendarTasks", JSON.stringify(tasks))
  }, [tasks])

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date)
    const firstDay = getFirstDayOfMonth(date)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), day))
    }

    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const getTasksForDate = (date: Date) => {
    const dateKey = getDateKey(date)
    return tasks[dateKey] || []
  }

  const hasTasksForDate = (date: Date) => {
    const dateTasks = getTasksForDate(date)
    return dateTasks.length > 0
  }

  const getCompletedTasksCount = (date: Date) => {
    const dateTasks = getTasksForDate(date)
    return dateTasks.filter((task) => task.completed).length
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dateTasks = getTasksForDate(date)
    if (dateTasks.length > 0) {
      setShowDayTasksDialog(true)
    } else {
      setShowTaskDialog(true)
    }
  }

  const handleAddTask = () => {
    if (!selectedDate || !newTask.title.trim()) return

    const dateKey = getDateKey(selectedDate)
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      completed: false,
      createdAt: new Date(),
    }

    setTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), task],
    }))

    setNewTask({ title: "", description: "", priority: "medium" })
    setShowTaskDialog(false)
  }

  const handleToggleTask = (taskId: string) => {
    if (!selectedDate) return

    const dateKey = getDateKey(selectedDate)
    setTasks((prev) => ({
      ...prev,
      [dateKey]:
        prev[dateKey]?.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)) || [],
    }))
  }

  const handleDeleteTask = (taskId: string) => {
    if (!selectedDate) return

    const dateKey = getDateKey(selectedDate)
    setTasks((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((task) => task.id !== taskId) || [],
    }))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

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
                <BreadcrumbPage className="text-gray-300 font-medium">Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-500" />
                  Task Calendar
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm lg:text-base">Plan and track your coding tasks</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-white min-w-[140px] sm:min-w-[180px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Single Month Calendar for Mobile, Three Months for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Mobile: Show only current month */}
              <div className="lg:hidden">
                <Card className="card-professional">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg font-bold text-white text-center">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 p-1">
                          {day.slice(0, 1)}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays(currentDate).map((date, index) => {
                        if (!date) {
                          return <div key={index} className="h-8" />
                        }

                        const dayTasks = getTasksForDate(date)
                        const completedCount = getCompletedTasksCount(date)
                        const totalTasks = dayTasks.length

                        return (
                          <button
                            key={index}
                            onClick={() => handleDateClick(date)}
                            className={`
                              h-8 w-full rounded-md text-xs font-medium transition-all duration-200 relative
                              ${
                                isToday(date)
                                  ? "bg-orange-500 text-white shadow-lg"
                                  : isSelected(date)
                                    ? "bg-blue-500 text-white"
                                    : hasTasksForDate(date)
                                      ? "bg-gray-700 text-white hover:bg-gray-600"
                                      : "text-gray-300 hover:bg-gray-800"
                              }
                            `}
                          >
                            {date.getDate()}

                            {/* Task indicators */}
                            {totalTasks > 0 && (
                              <div className="absolute -top-0.5 -right-0.5 flex items-center gap-1">
                                <div
                                  className={`
                                  w-2.5 h-2.5 rounded-full text-xs flex items-center justify-center font-bold
                                  ${
                                    completedCount === totalTasks
                                      ? "bg-green-500 text-white"
                                      : "bg-yellow-500 text-black"
                                  }
                                `}
                                >
                                  {totalTasks > 9 ? "9+" : totalTasks}
                                </div>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Desktop: Show three months */}
              <div className="hidden lg:contents">
                {[0, 1, 2].map((monthOffset) => {
                  const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1)
                  return (
                    <Card key={monthOffset} className="card-professional">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-white text-center">
                          {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map((day) => (
                            <div key={day} className="text-center text-xs font-medium text-gray-400 p-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays(monthDate).map((date, index) => {
                            if (!date) {
                              return <div key={index} className="h-10" />
                            }

                            const dayTasks = getTasksForDate(date)
                            const completedCount = getCompletedTasksCount(date)
                            const totalTasks = dayTasks.length

                            return (
                              <button
                                key={index}
                                onClick={() => handleDateClick(date)}
                                className={`
                                  h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
                                  ${
                                    isToday(date)
                                      ? "bg-orange-500 text-white shadow-lg"
                                      : isSelected(date)
                                        ? "bg-blue-500 text-white"
                                        : hasTasksForDate(date)
                                          ? "bg-gray-700 text-white hover:bg-gray-600"
                                          : "text-gray-300 hover:bg-gray-800"
                                  }
                                `}
                              >
                                {date.getDate()}

                                {/* Task indicators */}
                                {totalTasks > 0 && (
                                  <div className="absolute -top-1 -right-1 flex items-center gap-1">
                                    <div
                                      className={`
                                      w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold
                                      ${
                                        completedCount === totalTasks
                                          ? "bg-green-500 text-white"
                                          : "bg-yellow-500 text-black"
                                      }
                                    `}
                                    >
                                      {totalTasks}
                                    </div>
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <Card className="card-professional">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg font-bold text-white">Legend</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-500"></div>
                    <span className="text-gray-300">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-700"></div>
                    <span className="text-gray-300">Has Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">All Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300">Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {/* Add Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-sm sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-white text-sm sm:text-base">
              Add Task for{" "}
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Create a new task for the selected date
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300 text-sm">
                Task Title
              </Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300 text-sm">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description..."
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[60px] sm:min-h-[80px] text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300 text-sm">
                Priority
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setNewTask((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low" className="text-green-400 text-sm">
                    Low Priority
                  </SelectItem>
                  <SelectItem value="medium" className="text-yellow-400 text-sm">
                    Medium Priority
                  </SelectItem>
                  <SelectItem value="high" className="text-red-400 text-sm">
                    High Priority
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTaskDialog(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm"
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Tasks Dialog */}
      <Dialog open={showDayTasksDialog} onOpenChange={setShowDayTasksDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-sm sm:max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm sm:text-base">
                Tasks for{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <Button
                onClick={() => {
                  setShowDayTasksDialog(false)
                  setShowTaskDialog(true)
                }}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add Task
              </Button>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""} scheduled
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Target className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-sm">No tasks scheduled for this day</p>
                <Button
                  onClick={() => {
                    setShowDayTasksDialog(false)
                    setShowTaskDialog(true)
                  }}
                  className="mt-3 sm:mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add First Task
                </Button>
              </div>
            ) : (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 sm:p-4 rounded-lg border transition-all ${
                    task.completed ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50 border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-600 hover:border-green-500"
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-sm sm:text-base ${task.completed ? "text-green-400 line-through" : "text-white"}`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`text-xs sm:text-sm mt-1 ${task.completed ? "text-green-400/70" : "text-gray-400"}`}
                          >
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`${priorityColors[task.priority]} text-xs`}>{task.priority}</Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {task.createdAt.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedDateTasks.length > 0 && (
            <div className="border-t border-gray-700 pt-3 sm:pt-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                <span>
                  {selectedDateTasks.filter((t) => t.completed).length} of {selectedDateTasks.length} completed
                </span>
                <span>
                  {Math.round((selectedDateTasks.filter((t) => t.completed).length / selectedDateTasks.length) * 100)}%
                  done
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
