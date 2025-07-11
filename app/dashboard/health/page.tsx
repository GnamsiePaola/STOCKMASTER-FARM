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
import { Plus, Edit, Trash2, Heart, Syringe, Calendar, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface HealthRecord {
  id: number
  treatmentType: string
  treatmentName: string
  treatmentDate: string
  nextDueDate: string | null
  notes: string
  cost: number
  createdAt: string
}

export default function HealthPage() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<HealthRecord | null>(null)
  const [formData, setFormData] = useState({
    treatmentType: "",
    treatmentName: "",
    treatmentDate: "",
    nextDueDate: "",
    notes: "",
    cost: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchHealthRecords()
  }, [])

  const fetchHealthRecords = async () => {
    try {
      const response = await fetch("/api/health")
      if (response.ok) {
        const data = await response.json()
        setHealthRecords(data)
      }
    } catch (error) {
      console.error("Error fetching health records:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/health/${editingItem.id}` : "/api/health"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentType: formData.treatmentType,
          treatmentName: formData.treatmentName,
          treatmentDate: formData.treatmentDate,
          nextDueDate: formData.nextDueDate || null,
          notes: formData.notes,
          cost: Number.parseFloat(formData.cost) || 0,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Health record updated successfully!" : "Health record added successfully!")
        setDialogOpen(false)
        resetForm()
        fetchHealthRecords()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this health record?")) return

    try {
      const response = await fetch(`/api/health/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Health record deleted successfully!")
        fetchHealthRecords()
      }
    } catch (error) {
      setError("Failed to delete health record")
    }
  }

  const resetForm = () => {
    setFormData({
      treatmentType: "",
      treatmentName: "",
      treatmentDate: "",
      nextDueDate: "",
      notes: "",
      cost: "",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: HealthRecord) => {
    setEditingItem(item)
    setFormData({
      treatmentType: item.treatmentType,
      treatmentName: item.treatmentName,
      treatmentDate: item.treatmentDate,
      nextDueDate: item.nextDueDate || "",
      notes: item.notes,
      cost: item.cost.toString(),
    })
    setDialogOpen(true)
  }

  // Calculate statistics
  const totalTreatments = healthRecords.length
  const totalCost = healthRecords.reduce((sum, item) => sum + item.cost, 0)
  const vaccinations = healthRecords.filter((item) => item.treatmentType === "vaccination").length
  const upcomingDue = healthRecords.filter((item) => {
    if (!item.nextDueDate) return false
    const dueDate = new Date(item.nextDueDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return dueDate <= thirtyDaysFromNow && dueDate >= new Date()
  }).length

  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Syringe className="w-4 h-4" />
      case "medication":
        return <Heart className="w-4 h-4" />
      case "checkup":
        return <Calendar className="w-4 h-4" />
      default:
        return <Heart className="w-4 h-4" />
    }
  }

  const getTreatmentColor = (type: string) => {
    switch (type) {
      case "vaccination":
        return "bg-blue-100 text-blue-800"
      case "medication":
        return "bg-red-100 text-red-800"
      case "checkup":
        return "bg-green-100 text-green-800"
      case "treatment":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-red-50 to-pink-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">Manage poultry health, vaccinations, and treatments</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Health Management"
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
            <CardTitle className="text-sm font-medium">Total Treatments</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalTreatments}</div>
            <p className="text-xs text-muted-foreground">All health records</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
            <Syringe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{vaccinations}</div>
            <p className="text-xs text-muted-foreground">Vaccination records</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Cost</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total health expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{upcomingDue}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
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

      {/* Main Content */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Health Management</CardTitle>
              <CardDescription>Track vaccinations, treatments, and health checkups</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Health Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Health Record</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Enter"} the health treatment details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="treatmentType">Treatment Type</Label>
                    <Select
                      value={formData.treatmentType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, treatmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select treatment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="checkup">Health Checkup</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="treatmentName">Treatment Name</Label>
                    <Input
                      id="treatmentName"
                      value={formData.treatmentName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, treatmentName: e.target.value }))}
                      placeholder="e.g., Newcastle Disease Vaccine"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="treatmentDate">Treatment Date</Label>
                      <Input
                        id="treatmentDate"
                        type="date"
                        value={formData.treatmentDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, treatmentDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextDueDate">Next Due Date</Label>
                      <Input
                        id="nextDueDate"
                        type="date"
                        value={formData.nextDueDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nextDueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
                      placeholder="Treatment cost"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes about the treatment"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Add"} Health Record
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
                  <TableHead>Type</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthRecords.map((item) => {
                  const isDueSoon =
                    item.nextDueDate && new Date(item.nextDueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  const isOverdue = item.nextDueDate && new Date(item.nextDueDate) < new Date()

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTreatmentIcon(item.treatmentType)}
                          <Badge className={getTreatmentColor(item.treatmentType)}>{item.treatmentType}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.treatmentName}</TableCell>
                      <TableCell>{new Date(item.treatmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>${item.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                        {isDueSoon && !isOverdue && <Badge variant="outline">Due Soon</Badge>}
                        {!isDueSoon && !isOverdue && <Badge variant="secondary">Current</Badge>}
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

      {/* Upcoming Treatments */}
      {upcomingDue > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span>Upcoming Treatments</span>
            </CardTitle>
            <CardDescription>Treatments due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthRecords
                .filter((item) => {
                  if (!item.nextDueDate) return false
                  const dueDate = new Date(item.nextDueDate)
                  const thirtyDaysFromNow = new Date()
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                  return dueDate <= thirtyDaysFromNow && dueDate >= new Date()
                })
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        {getTreatmentIcon(item.treatmentType)}
                      </div>
                      <div>
                        <p className="font-medium">{item.treatmentName}</p>
                        <p className="text-sm text-gray-600">{item.treatmentType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-600">
                        {item.nextDueDate && new Date(item.nextDueDate).toLocaleDateString()}
                      </p>
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
