"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Bell, Calendar, CheckCircle, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface Reminder {
  id: number
  title: string
  description: string
  reminderDate: string
  reminderType: string
  isCompleted: boolean
  createdAt: string
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Reminder | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reminderDate: "",
    reminderType: "general",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all")

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders")
      if (response.ok) {
        const data = await response.json()
        setReminders(data)
      }
    } catch (error) {
      console.error("Error fetching reminders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/reminders/${editingItem.id}` : "/api/reminders"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          reminderDate: formData.reminderDate,
          reminderType: formData.reminderType,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Reminder updated successfully!" : "Reminder created successfully!")
        setDialogOpen(false)
        resetForm()
        fetchReminders()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleToggleComplete = async (id: number, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/reminders/${id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      })

      if (response.ok) {
        setSuccess(`Reminder ${!isCompleted ? "completed" : "reopened"} successfully!`)
        fetchReminders()
      }
    } catch (error) {
      setError("Failed to update reminder status")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return

    try {
      const response = await fetch(`/api/reminders/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Reminder deleted successfully!")
        fetchReminders()
      }
    } catch (error) {
      setError("Failed to delete reminder")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reminderDate: "",
      reminderType: "general",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: Reminder) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      reminderDate: item.reminderDate,
      reminderType: item.reminderType,
    })
    setDialogOpen(true)
  }

  // Filter reminders
  const filteredReminders = reminders.filter((reminder) => {
    const reminderDate = new Date(reminder.reminderDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (filter) {
      case "pending":
        return !reminder.isCompleted
      case "completed":
        return reminder.isCompleted
      case "overdue":
        return !reminder.isCompleted && reminderDate < today
      default:
        return true
    }
  })

  // Calculate statistics
  const totalReminders = reminders.length
  const completedReminders = reminders.filter((r) => r.isCompleted).length
  const pendingReminders = reminders.filter((r) => !r.isCompleted).length
  const overdueReminders = reminders.filter((r) => {
    const reminderDate = new Date(r.reminderDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return !r.isCompleted && reminderDate < today
  }).length

  const getReminderTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vaccination: "bg-blue-100 text-blue-800",
      feeding: "bg-green-100 text-green-800",
      health_check: "bg-red-100 text-red-800",
      payment: "bg-yellow-100 text-yellow-800",
      general: "bg-gray-100 text-gray-800",
    }
    return colors[type] || colors.general
  }

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Bell className="w-4 h-4" />
      case "feeding":
        return <Calendar className="w-4 h-4" />
      case "health_check":
        return <AlertTriangle className="w-4 h-4" />
      case "payment":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-indigo-50 to-cyan-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-1">Manage tasks and important notifications</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Reminders"
            width={120}
            height={80}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
            <Bell className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{totalReminders}</div>
            <p className="text-xs text-muted-foreground">All reminders</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingReminders}</div>
            <p className="text-xs text-muted-foreground">Not completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedReminders}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueReminders}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2 bg-white/50 p-2 rounded-lg">
        <Button variant={filter === "all" ? "default" : "ghost"} onClick={() => setFilter("all")} size="sm">
          All
        </Button>
        <Button variant={filter === "pending" ? "default" : "ghost"} onClick={() => setFilter("pending")} size="sm">
          Pending
        </Button>
        <Button variant={filter === "completed" ? "default" : "ghost"} onClick={() => setFilter("completed")} size="sm">
          Completed
        </Button>
        <Button variant={filter === "overdue" ? "default" : "ghost"} onClick={() => setFilter("overdue")} size="sm">
          Overdue
        </Button>
      </div>

      {/* Main Content */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reminder Management</CardTitle>
              <CardDescription>Create and manage important reminders and tasks</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Create"} Reminder</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Enter"} reminder details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Reminder title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminderDate">Reminder Date</Label>
                      <Input
                        id="reminderDate"
                        type="date"
                        value={formData.reminderDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, reminderDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminderType">Type</Label>
                      <Select
                        value={formData.reminderType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, reminderType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="feeding">Feeding</SelectItem>
                          <SelectItem value="health_check">Health Check</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Create"} Reminder
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReminders.map((item) => {
                  const reminderDate = new Date(item.reminderDate)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const isOverdue = !item.isCompleted && reminderDate < today
                  const isDueToday = !item.isCompleted && reminderDate.toDateString() === today.toDateString()

                  return (
                    <TableRow key={item.id} className={item.isCompleted ? "opacity-60" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={item.isCompleted}
                          onCheckedChange={() => handleToggleComplete(item.id, item.isCompleted)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className={`font-medium ${item.isCompleted ? "line-through" : ""}`}>{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getReminderIcon(item.reminderType)}
                          <Badge className={getReminderTypeColor(item.reminderType)}>
                            {item.reminderType.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{reminderDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                        {isDueToday && !isOverdue && <Badge variant="outline">Due Today</Badge>}
                        {!isOverdue && !isDueToday && !item.isCompleted && <Badge variant="secondary">Upcoming</Badge>}
                        {item.isCompleted && <Badge variant="default">Completed</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      {overdueReminders > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Overdue Reminders</span>
            </CardTitle>
            <CardDescription>These reminders are past their due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders
                .filter((reminder) => {
                  const reminderDate = new Date(reminder.reminderDate)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return !reminder.isCompleted && reminderDate < today
                })
                .map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        {getReminderIcon(reminder.reminderType)}
                      </div>
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-gray-600">{reminder.reminderType.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{new Date(reminder.reminderDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Due date</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
