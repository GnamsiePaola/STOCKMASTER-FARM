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
import { Plus, Edit, Trash2, TrendingDown, Receipt, Wallet, Calculator } from "lucide-react"
import Image from "next/image"

interface Expense {
  id: number
  expenseDate: string
  category: string
  description: string
  amount: number
  supplier: string
  receiptNumber: string
  createdAt: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    expenseDate: "",
    category: "",
    description: "",
    amount: "",
    supplier: "",
    receiptNumber: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses")
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/expenses/${editingItem.id}` : "/api/expenses"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenseDate: formData.expenseDate,
          category: formData.category,
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          supplier: formData.supplier,
          receiptNumber: formData.receiptNumber,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Expense updated successfully!" : "Expense recorded successfully!")
        setDialogOpen(false)
        resetForm()
        fetchExpenses()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Expense deleted successfully!")
        fetchExpenses()
      }
    } catch (error) {
      setError("Failed to delete expense")
    }
  }

  const resetForm = () => {
    setFormData({
      expenseDate: "",
      category: "",
      description: "",
      amount: "",
      supplier: "",
      receiptNumber: "",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: Expense) => {
    setEditingItem(item)
    setFormData({
      expenseDate: item.expenseDate,
      category: item.category,
      description: item.description,
      amount: item.amount.toString(),
      supplier: item.supplier,
      receiptNumber: item.receiptNumber,
    })
    setDialogOpen(true)
  }

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const monthlyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.expenseDate)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    .reduce((sum, item) => sum + item.amount, 0)

  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      feed: "bg-amber-100 text-amber-800",
      medication: "bg-red-100 text-red-800",
      equipment: "bg-blue-100 text-blue-800",
      utilities: "bg-green-100 text-green-800",
      labor: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.other
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-red-50 to-rose-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage farm expenses and costs</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Expense Management"
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
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calculator className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
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
              <CardTitle>Expense Management</CardTitle>
              <CardDescription>Record and track all farm expenses</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Expense</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Enter"} the expense details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenseDate">Expense Date</Label>
                    <Input
                      id="expenseDate"
                      type="date"
                      value={formData.expenseDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, expenseDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feed">Feed</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the expense"
                      required
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder="Expense amount"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiptNumber">Receipt #</Label>
                      <Input
                        id="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, receiptNumber: e.target.value }))}
                        placeholder="Receipt number"
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
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Add"} Expense
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
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.expenseDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell className="font-bold">${item.amount.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier || "-"}</TableCell>
                    <TableCell>{item.receiptNumber || "-"}</TableCell>
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

      {/* Expense Categories Breakdown */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown of expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium capitalize">{category}</p>
                  <p className="text-sm text-gray-600">
                    {expenses.filter((e) => e.category === category).length} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
