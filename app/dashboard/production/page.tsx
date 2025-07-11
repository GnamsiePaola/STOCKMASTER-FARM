"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Egg, TrendingUp, Calendar, Target } from "lucide-react"
import Image from "next/image"

interface EggProduction {
  id: number
  productionDate: string
  eggsCollected: number
  brokenEggs: number
  notes: string
  createdAt: string
}

export default function ProductionPage() {
  const [productions, setProductions] = useState<EggProduction[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EggProduction | null>(null)
  const [formData, setFormData] = useState({
    productionDate: "",
    eggsCollected: "",
    brokenEggs: "0",
    notes: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchProductions()
  }, [])

  const fetchProductions = async () => {
    try {
      const response = await fetch("/api/production")
      if (response.ok) {
        const data = await response.json()
        setProductions(data)
      }
    } catch (error) {
      console.error("Error fetching productions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/production/${editingItem.id}` : "/api/production"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productionDate: formData.productionDate,
          eggsCollected: Number.parseInt(formData.eggsCollected),
          brokenEggs: Number.parseInt(formData.brokenEggs),
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Production updated successfully!" : "Production recorded successfully!")
        setDialogOpen(false)
        resetForm()
        fetchProductions()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this production record?")) return

    try {
      const response = await fetch(`/api/production/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Production record deleted successfully!")
        fetchProductions()
      }
    } catch (error) {
      setError("Failed to delete production record")
    }
  }

  const resetForm = () => {
    setFormData({
      productionDate: "",
      eggsCollected: "",
      brokenEggs: "0",
      notes: "",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: EggProduction) => {
    setEditingItem(item)
    setFormData({
      productionDate: item.productionDate,
      eggsCollected: item.eggsCollected.toString(),
      brokenEggs: item.brokenEggs.toString(),
      notes: item.notes,
    })
    setDialogOpen(true)
  }

  // Calculate statistics
  const totalEggs = productions.reduce((sum, item) => sum + item.eggsCollected, 0)
  const totalBroken = productions.reduce((sum, item) => sum + item.brokenEggs, 0)
  const averageDaily = productions.length > 0 ? Math.round(totalEggs / productions.length) : 0
  const brokenPercentage = totalEggs > 0 ? ((totalBroken / totalEggs) * 100).toFixed(1) : "0"

  // Get recent 7 days data
  const recentProductions = productions.slice(0, 7)

  return (
    <div className="space-y-6 bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Egg Production</h1>
          <p className="text-gray-600 mt-1">Track daily egg collection and production metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Egg Production"
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
            <CardTitle className="text-sm font-medium">Total Eggs</CardTitle>
            <Egg className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalEggs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time collection</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averageDaily}</div>
            <p className="text-xs text-muted-foreground">Eggs per day</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broken Eggs</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalBroken}</div>
            <p className="text-xs text-muted-foreground">{brokenPercentage}% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{productions.length}</div>
            <p className="text-xs text-muted-foreground">Production days</p>
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
              <CardTitle>Production Records</CardTitle>
              <CardDescription>Daily egg collection and quality tracking</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Production
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Record"} Egg Production</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Enter"} the daily production details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productionDate">Production Date</Label>
                    <Input
                      id="productionDate"
                      type="date"
                      value={formData.productionDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productionDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eggsCollected">Eggs Collected</Label>
                      <Input
                        id="eggsCollected"
                        type="number"
                        value={formData.eggsCollected}
                        onChange={(e) => setFormData((prev) => ({ ...prev, eggsCollected: e.target.value }))}
                        placeholder="Number of eggs"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brokenEggs">Broken Eggs</Label>
                      <Input
                        id="brokenEggs"
                        type="number"
                        value={formData.brokenEggs}
                        onChange={(e) => setFormData((prev) => ({ ...prev, brokenEggs: e.target.value }))}
                        placeholder="Number broken"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional observations"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Record"} Production
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
                  <TableHead>Date</TableHead>
                  <TableHead>Eggs Collected</TableHead>
                  <TableHead>Broken Eggs</TableHead>
                  <TableHead>Quality Rate</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productions.map((item) => {
                  const qualityRate =
                    item.eggsCollected > 0
                      ? (((item.eggsCollected - item.brokenEggs) / item.eggsCollected) * 100).toFixed(1)
                      : "0"

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {new Date(item.productionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.eggsCollected}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.brokenEggs > 0 ? "destructive" : "secondary"}>{item.brokenEggs}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={Number.parseFloat(qualityRate) >= 95 ? "default" : "outline"}>
                          {qualityRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
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

      {/* Recent Production Chart */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Production Trend</CardTitle>
          <CardDescription>Last 7 days egg collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProductions.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Egg className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{new Date(item.productionDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{item.notes || "No notes"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{item.eggsCollected}</p>
                  <p className="text-sm text-gray-600">{item.brokenEggs} broken</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
