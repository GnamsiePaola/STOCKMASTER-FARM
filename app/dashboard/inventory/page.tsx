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
import { Plus, Edit, Trash2, Bird, TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"

interface PoultryBatch {
  id: number
  birdType: string
  breed: string
  currentCount: number
  ageWeeks: number
  purchaseDate: string
  purchasePrice: number
  mortalityCount: number
  createdAt: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<PoultryBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PoultryBatch | null>(null)
  const [formData, setFormData] = useState({
    birdType: "",
    breed: "",
    currentCount: "",
    ageWeeks: "",
    purchaseDate: "",
    purchasePrice: "",
    mortalityCount: "0",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory")
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/inventory/${editingItem.id}` : "/api/inventory"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birdType: formData.birdType,
          breed: formData.breed,
          currentCount: Number.parseInt(formData.currentCount),
          ageWeeks: Number.parseInt(formData.ageWeeks),
          purchaseDate: formData.purchaseDate,
          purchasePrice: Number.parseFloat(formData.purchasePrice),
          mortalityCount: Number.parseInt(formData.mortalityCount),
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Inventory updated successfully!" : "Inventory added successfully!")
        setDialogOpen(false)
        resetForm()
        fetchInventory()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return

    try {
      const response = await fetch(`/api/inventory/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Inventory deleted successfully!")
        fetchInventory()
      }
    } catch (error) {
      setError("Failed to delete inventory")
    }
  }

  const resetForm = () => {
    setFormData({
      birdType: "",
      breed: "",
      currentCount: "",
      ageWeeks: "",
      purchaseDate: "",
      purchasePrice: "",
      mortalityCount: "0",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: PoultryBatch) => {
    setEditingItem(item)
    setFormData({
      birdType: item.birdType,
      breed: item.breed,
      currentCount: item.currentCount.toString(),
      ageWeeks: item.ageWeeks.toString(),
      purchaseDate: item.purchaseDate,
      purchasePrice: item.purchasePrice.toString(),
      mortalityCount: item.mortalityCount.toString(),
    })
    setDialogOpen(true)
  }

  const totalBirds = inventory.reduce((sum, item) => sum + item.currentCount, 0)
  const totalMortality = inventory.reduce((sum, item) => sum + item.mortalityCount, 0)
  const totalValue = inventory.reduce((sum, item) => sum + item.purchasePrice, 0)

  return (
    <div className="space-y-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Poultry Inventory</h1>
          <p className="text-gray-600 mt-1">Manage your poultry stock and track bird counts</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Poultry Inventory"
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
            <CardTitle className="text-sm font-medium">Total Birds</CardTitle>
            <Bird className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalBirds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active poultry count</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batches</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Different batches</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mortality</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalMortality}</div>
            <p className="text-xs text-muted-foreground">Total deaths</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Investment value</p>
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
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Add, edit, and manage your poultry inventory</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Poultry Batch</DialogTitle>
                  <DialogDescription>
                    {editingItem ? "Update" : "Enter"} the details for the poultry batch
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birdType">Bird Type</Label>
                      <Select
                        value={formData.birdType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, birdType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chicken">Chicken</SelectItem>
                          <SelectItem value="Duck">Duck</SelectItem>
                          <SelectItem value="Turkey">Turkey</SelectItem>
                          <SelectItem value="Goose">Goose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={formData.breed}
                        onChange={(e) => setFormData((prev) => ({ ...prev, breed: e.target.value }))}
                        placeholder="e.g., Rhode Island Red"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentCount">Current Count</Label>
                      <Input
                        id="currentCount"
                        type="number"
                        value={formData.currentCount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currentCount: e.target.value }))}
                        placeholder="Number of birds"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ageWeeks">Age (Weeks)</Label>
                      <Input
                        id="ageWeeks"
                        type="number"
                        value={formData.ageWeeks}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ageWeeks: e.target.value }))}
                        placeholder="Age in weeks"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, purchaseDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, purchasePrice: e.target.value }))}
                        placeholder="Total cost"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mortalityCount">Mortality Count</Label>
                    <Input
                      id="mortalityCount"
                      type="number"
                      value={formData.mortalityCount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mortalityCount: e.target.value }))}
                      placeholder="Number of deaths"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Add"} Batch
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
                  <TableHead>Bird Type</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Mortality</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.birdType}</TableCell>
                    <TableCell>{item.breed}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.currentCount}</Badge>
                    </TableCell>
                    <TableCell>{item.ageWeeks} weeks</TableCell>
                    <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>${item.purchasePrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.mortalityCount > 0 ? "destructive" : "secondary"}>
                        {item.mortalityCount}
                      </Badge>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
