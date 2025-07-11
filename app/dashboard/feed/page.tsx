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
import { Plus, Edit, Trash2, Wheat, AlertTriangle, Package } from "lucide-react"
import Image from "next/image"

interface FeedItem {
  id: number
  feedType: string
  quantityKg: number
  unitPrice: number
  supplier: string
  purchaseDate: string
  expiryDate: string
  createdAt: string
}

interface FeedConsumption {
  id: number
  feedId: number
  consumptionDate: string
  quantityUsed: number
  notes: string
  feedType: string
}

export default function FeedManagementPage() {
  const [feedInventory, setFeedInventory] = useState<FeedItem[]>([])
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"inventory" | "consumption">("inventory")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [consumptionDialogOpen, setConsumptionDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FeedItem | null>(null)
  const [formData, setFormData] = useState({
    feedType: "",
    quantityKg: "",
    unitPrice: "",
    supplier: "",
    purchaseDate: "",
    expiryDate: "",
  })
  const [consumptionData, setConsumptionData] = useState({
    feedId: "",
    consumptionDate: "",
    quantityUsed: "",
    notes: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchFeedData()
  }, [])

  const fetchFeedData = async () => {
    try {
      const [inventoryRes, consumptionRes] = await Promise.all([
        fetch("/api/feed/inventory"),
        fetch("/api/feed/consumption"),
      ])

      if (inventoryRes.ok) {
        const inventoryData = await inventoryRes.json()
        setFeedInventory(inventoryData)
      }

      if (consumptionRes.ok) {
        const consumptionData = await consumptionRes.json()
        setFeedConsumption(consumptionData)
      }
    } catch (error) {
      console.error("Error fetching feed data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/feed/inventory/${editingItem.id}` : "/api/feed/inventory"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedType: formData.feedType,
          quantityKg: Number.parseFloat(formData.quantityKg),
          unitPrice: Number.parseFloat(formData.unitPrice),
          supplier: formData.supplier,
          purchaseDate: formData.purchaseDate,
          expiryDate: formData.expiryDate,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Feed updated successfully!" : "Feed added successfully!")
        setDialogOpen(false)
        resetForm()
        fetchFeedData()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleConsumptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/feed/consumption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedId: Number.parseInt(consumptionData.feedId),
          consumptionDate: consumptionData.consumptionDate,
          quantityUsed: Number.parseFloat(consumptionData.quantityUsed),
          notes: consumptionData.notes,
        }),
      })

      if (response.ok) {
        setSuccess("Feed consumption recorded successfully!")
        setConsumptionDialogOpen(false)
        resetConsumptionForm()
        fetchFeedData()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feed item?")) return

    try {
      const response = await fetch(`/api/feed/inventory/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Feed deleted successfully!")
        fetchFeedData()
      }
    } catch (error) {
      setError("Failed to delete feed")
    }
  }

  const resetForm = () => {
    setFormData({
      feedType: "",
      quantityKg: "",
      unitPrice: "",
      supplier: "",
      purchaseDate: "",
      expiryDate: "",
    })
    setEditingItem(null)
  }

  const resetConsumptionForm = () => {
    setConsumptionData({
      feedId: "",
      consumptionDate: "",
      quantityUsed: "",
      notes: "",
    })
  }

  const openEditDialog = (item: FeedItem) => {
    setEditingItem(item)
    setFormData({
      feedType: item.feedType,
      quantityKg: item.quantityKg.toString(),
      unitPrice: item.unitPrice.toString(),
      supplier: item.supplier,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
    })
    setDialogOpen(true)
  }

  const totalFeedStock = feedInventory.reduce((sum, item) => sum + item.quantityKg, 0)
  const totalFeedValue = feedInventory.reduce((sum, item) => sum + item.quantityKg * item.unitPrice, 0)
  const lowStockItems = feedInventory.filter((item) => item.quantityKg < 100)
  const expiringItems = feedInventory.filter((item) => {
    const expiryDate = new Date(item.expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow
  })

  return (
    <div className="space-y-6 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feed Management</h1>
          <p className="text-gray-600 mt-1">Manage feed inventory and track consumption</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Feed Management"
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
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Wheat className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{totalFeedStock.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">Available feed</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalFeedValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below 100kg</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringItems.length}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/50 p-1 rounded-lg">
        <Button
          variant={activeTab === "inventory" ? "default" : "ghost"}
          onClick={() => setActiveTab("inventory")}
          className="flex-1"
        >
          Feed Inventory
        </Button>
        <Button
          variant={activeTab === "consumption" ? "default" : "ghost"}
          onClick={() => setActiveTab("consumption")}
          className="flex-1"
        >
          Feed Consumption
        </Button>
      </div>

      {/* Feed Inventory Tab */}
      {activeTab === "inventory" && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feed Inventory</CardTitle>
                <CardDescription>Manage your feed stock and suppliers</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feed Stock
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit" : "Add"} Feed Stock</DialogTitle>
                    <DialogDescription>{editingItem ? "Update" : "Enter"} the feed inventory details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="feedType">Feed Type</Label>
                      <Select
                        value={formData.feedType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, feedType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select feed type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Starter Feed">Starter Feed</SelectItem>
                          <SelectItem value="Grower Feed">Grower Feed</SelectItem>
                          <SelectItem value="Layer Feed">Layer Feed</SelectItem>
                          <SelectItem value="Broiler Feed">Broiler Feed</SelectItem>
                          <SelectItem value="Finisher Feed">Finisher Feed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantityKg">Quantity (kg)</Label>
                        <Input
                          id="quantityKg"
                          type="number"
                          step="0.1"
                          value={formData.quantityKg}
                          onChange={(e) => setFormData((prev) => ({ ...prev, quantityKg: e.target.value }))}
                          placeholder="Weight in kg"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitPrice">Unit Price ($/kg)</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          step="0.01"
                          value={formData.unitPrice}
                          onChange={(e) => setFormData((prev) => ({ ...prev, unitPrice: e.target.value }))}
                          placeholder="Price per kg"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
                        placeholder="Supplier name"
                        required
                      />
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
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingItem ? "Update" : "Add"} Feed Stock
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
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedInventory.map((item) => {
                    const isLowStock = item.quantityKg < 100
                    const isExpiringSoon = new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.feedType}</TableCell>
                        <TableCell>{item.quantityKg} kg</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>${(item.quantityKg * item.unitPrice).toFixed(2)}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {isLowStock && <Badge variant="destructive">Low Stock</Badge>}
                          {isExpiringSoon && (
                            <Badge variant="outline" className="ml-1">
                              Expiring
                            </Badge>
                          )}
                          {!isLowStock && !isExpiringSoon && <Badge variant="secondary">Good</Badge>}
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
      )}

      {/* Feed Consumption Tab */}
      {activeTab === "consumption" && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feed Consumption</CardTitle>
                <CardDescription>Track daily feed usage and consumption patterns</CardDescription>
              </div>
              <Dialog open={consumptionDialogOpen} onOpenChange={setConsumptionDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetConsumptionForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Record Consumption
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Record Feed Consumption</DialogTitle>
                    <DialogDescription>Enter the daily feed consumption details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleConsumptionSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="feedId">Feed Type</Label>
                      <Select
                        value={consumptionData.feedId}
                        onValueChange={(value) => setConsumptionData((prev) => ({ ...prev, feedId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select feed" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedInventory.map((feed) => (
                            <SelectItem key={feed.id} value={feed.id.toString()}>
                              {feed.feedType} ({feed.quantityKg}kg available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="consumptionDate">Date</Label>
                        <Input
                          id="consumptionDate"
                          type="date"
                          value={consumptionData.consumptionDate}
                          onChange={(e) => setConsumptionData((prev) => ({ ...prev, consumptionDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantityUsed">Quantity Used (kg)</Label>
                        <Input
                          id="quantityUsed"
                          type="number"
                          step="0.1"
                          value={consumptionData.quantityUsed}
                          onChange={(e) => setConsumptionData((prev) => ({ ...prev, quantityUsed: e.target.value }))}
                          placeholder="Amount used"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        value={consumptionData.notes}
                        onChange={(e) => setConsumptionData((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Record Consumption
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
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedConsumption.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.consumptionDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{item.feedType}</TableCell>
                      <TableCell>{item.quantityUsed} kg</TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
