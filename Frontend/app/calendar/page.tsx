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

  const getThreeMonths = () => {
    const months = []
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      months.push(monthDate)
    }
    return months
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
          <div className="container mx-auto max-w-7xl p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3 mb-2">
                  <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-orange-500" />
                  Task Calendar
                </h1>
                <p className="text-gray-400 text-base lg:text-lg">Plan and track your coding tasks</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold text-white min-w-[200px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Three Month Calendar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {getThreeMonths().map((monthDate, monthIndex) => (
                <Card key={monthIndex} className="card-professional">
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
              ))}
            </div>

            {/* Legend */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span className="text-gray-300">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-700"></div>
                    <span className="text-gray-300">Has Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">All Tasks Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300">Pending Tasks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {/* Add Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              Add Task for{" "}
              {selectedDate?.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription className="text-gray-400">Create a new task for the selected date</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Task Title
              </Label>
              <Input
                id="title"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description..."
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Priority
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setNewTask((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low" className="text-green-400">
                    Low Priority
                  </SelectItem>
                  <SelectItem value="medium" className="text-yellow-400">
                    Medium Priority
                  </SelectItem>
                  <SelectItem value="high" className="text-red-400">
                    High Priority
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTaskDialog(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Tasks Dialog */}
      <Dialog open={showDayTasksDialog} onOpenChange={setShowDayTasksDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>
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
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""} scheduled
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No tasks scheduled for this day</p>
                <Button
                  onClick={() => {
                    setShowDayTasksDialog(false)
                    setShowTaskDialog(true)
                  }}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Task
                </Button>
              </div>
            ) : (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50 border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-600 hover:border-green-500"
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="h-3 w-3" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${task.completed ? "text-green-400 line-through" : "text-white"}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${task.completed ? "text-green-400/70" : "text-gray-400"}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={priorityColors[task.priority]}>{task.priority} priority</Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
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
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedDateTasks.length > 0 && (
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
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
