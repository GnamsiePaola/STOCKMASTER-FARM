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
import { Plus, Edit, Trash2, DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react"
import Image from "next/image"

interface Sale {
  id: number
  saleDate: string
  productType: string
  quantity: number
  unitPrice: number
  totalAmount: number
  customerName: string
  customerContact: string
  paymentStatus: string
  createdAt: string
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Sale | null>(null)
  const [formData, setFormData] = useState({
    saleDate: "",
    productType: "",
    quantity: "",
    unitPrice: "",
    customerName: "",
    customerContact: "",
    paymentStatus: "pending",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales")
      if (response.ok) {
        const data = await response.json()
        setSales(data)
      }
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const totalAmount = Number.parseFloat(formData.quantity) * Number.parseFloat(formData.unitPrice)

    try {
      const url = editingItem ? `/api/sales/${editingItem.id}` : "/api/sales"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleDate: formData.saleDate,
          productType: formData.productType,
          quantity: Number.parseInt(formData.quantity),
          unitPrice: Number.parseFloat(formData.unitPrice),
          totalAmount: totalAmount,
          customerName: formData.customerName,
          customerContact: formData.customerContact,
          paymentStatus: formData.paymentStatus,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Sale updated successfully!" : "Sale recorded successfully!")
        setDialogOpen(false)
        resetForm()
        fetchSales()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sale record?")) return

    try {
      const response = await fetch(`/api/sales/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Sale deleted successfully!")
        fetchSales()
      }
    } catch (error) {
      setError("Failed to delete sale")
    }
  }

  const resetForm = () => {
    setFormData({
      saleDate: "",
      productType: "",
      quantity: "",
      unitPrice: "",
      customerName: "",
      customerContact: "",
      paymentStatus: "pending",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: Sale) => {
    setEditingItem(item)
    setFormData({
      saleDate: item.saleDate,
      productType: item.productType,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      customerName: item.customerName,
      customerContact: item.customerContact,
      paymentStatus: item.paymentStatus,
    })
    setDialogOpen(true)
  }

  // Calculate statistics
  const totalRevenue = sales.reduce((sum, item) => sum + item.totalAmount, 0)
  const totalSales = sales.length
  const paidSales = sales.filter((item) => item.paymentStatus === "paid")
  const pendingSales = sales.filter((item) => item.paymentStatus === "pending")
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "partial":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Revenue</h1>
          <p className="text-gray-600 mt-1">Track sales transactions and revenue performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Sales Management"
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time sales</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalSales}</div>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${averageSale.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingSales.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
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
              <CardTitle>Sales Management</CardTitle>
              <CardDescription>Record and track all sales transactions</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Record"} Sale</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Enter"} the sale transaction details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Sale Date</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, saleDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Select
                      value={formData.productType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, productType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eggs">Eggs</SelectItem>
                        <SelectItem value="birds">Live Birds</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                        placeholder="Amount sold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Unit Price ($)</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, unitPrice: e.target.value }))}
                        placeholder="Price per unit"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Customer name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerContact">Customer Contact</Label>
                    <Input
                      id="customerContact"
                      value={formData.customerContact}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerContact: e.target.value }))}
                      placeholder="Phone or email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.quantity && formData.unitPrice && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-bold">
                        $
                        {(
                          Number.parseFloat(formData.quantity || "0") * Number.parseFloat(formData.unitPrice || "0")
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Record"} Sale
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
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium capitalize">{item.productType}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="font-bold">${item.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.customerName}</p>
                        <p className="text-sm text-gray-600">{item.customerContact}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(item.paymentStatus)}>{item.paymentStatus}</Badge>
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

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Payment Status Summary</CardTitle>
            <CardDescription>Overview of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Paid Sales</p>
                    <p className="text-sm text-gray-600">{paidSales.length} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">
                    ${paidSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pending Sales</p>
                    <p className="text-sm text-gray-600">{pendingSales.length} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-yellow-600">
                    ${pendingSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Product Sales Breakdown</CardTitle>
            <CardDescription>Sales by product type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["eggs", "birds", "meat", "other"].map((productType) => {
                const productSales = sales.filter((sale) => sale.productType === productType)
                const productRevenue = productSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

                return (
                  <div key={productType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{productType}</p>
                      <p className="text-sm text-gray-600">{productSales.length} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${productRevenue.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {totalRevenue > 0 ? ((productRevenue / totalRevenue) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
