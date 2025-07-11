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
import { Plus, Edit, Trash2, Users, DollarSign, Calendar, UserCheck } from "lucide-react"
import Image from "next/image"

interface Employee {
  id: number
  employeeName: string
  position: string
  phone: string
  email: string
  hireDate: string
  salary: number
  paymentFrequency: string
  isActive: boolean
  createdAt: string
}

interface Payment {
  id: number
  employeeId: number
  employeeName: string
  paymentDate: string
  amount: number
  paymentPeriodStart: string
  paymentPeriodEnd: string
  paymentMethod: string
  notes: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"employees" | "payments">("employees")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    employeeName: "",
    position: "",
    phone: "",
    email: "",
    hireDate: "",
    salary: "",
    paymentFrequency: "monthly",
  })
  const [paymentData, setPaymentData] = useState({
    employeeId: "",
    paymentDate: "",
    amount: "",
    paymentPeriodStart: "",
    paymentPeriodEnd: "",
    paymentMethod: "cash",
    notes: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchEmployees()
    fetchPayments()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/employees/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/employees/${editingItem.id}` : "/api/employees"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName: formData.employeeName,
          position: formData.position,
          phone: formData.phone,
          email: formData.email,
          hireDate: formData.hireDate,
          salary: Number.parseFloat(formData.salary),
          paymentFrequency: formData.paymentFrequency,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Employee updated successfully!" : "Employee added successfully!")
        setDialogOpen(false)
        resetForm()
        fetchEmployees()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/employees/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: Number.parseInt(paymentData.employeeId),
          paymentDate: paymentData.paymentDate,
          amount: Number.parseFloat(paymentData.amount),
          paymentPeriodStart: paymentData.paymentPeriodStart,
          paymentPeriodEnd: paymentData.paymentPeriodEnd,
          paymentMethod: paymentData.paymentMethod,
          notes: paymentData.notes,
        }),
      })

      if (response.ok) {
        setSuccess("Payment recorded successfully!")
        setPaymentDialogOpen(false)
        resetPaymentForm()
        fetchPayments()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      const response = await fetch(`/api/employees/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Employee deleted successfully!")
        fetchEmployees()
      }
    } catch (error) {
      setError("Failed to delete employee")
    }
  }

  const resetForm = () => {
    setFormData({
      employeeName: "",
      position: "",
      phone: "",
      email: "",
      hireDate: "",
      salary: "",
      paymentFrequency: "monthly",
    })
    setEditingItem(null)
  }

  const resetPaymentForm = () => {
    setPaymentData({
      employeeId: "",
      paymentDate: "",
      amount: "",
      paymentPeriodStart: "",
      paymentPeriodEnd: "",
      paymentMethod: "cash",
      notes: "",
    })
  }

  const openEditDialog = (item: Employee) => {
    setEditingItem(item)
    setFormData({
      employeeName: item.employeeName,
      position: item.position,
      phone: item.phone,
      email: item.email,
      hireDate: item.hireDate,
      salary: item.salary.toString(),
      paymentFrequency: item.paymentFrequency,
    })
    setDialogOpen(true)
  }

  const totalEmployees = employees.filter((emp) => emp.isActive).length
  const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const thisMonthPayments = payments
    .filter((payment) => {
      const paymentDate = new Date(payment.paymentDate)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
    })
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage staff and track payroll</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Employee Management"
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
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Current staff</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salaries</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSalaries.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total monthly cost</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Paid</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${thisMonthPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <UserCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalPayments.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
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
          variant={activeTab === "employees" ? "default" : "ghost"}
          onClick={() => setActiveTab("employees")}
          className="flex-1"
        >
          Employees
        </Button>
        <Button
          variant={activeTab === "payments" ? "default" : "ghost"}
          onClick={() => setActiveTab("payments")}
          className="flex-1"
        >
          Payments
        </Button>
      </div>

      {/* Employees Tab */}
      {activeTab === "employees" && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage your farm staff and their details</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit" : "Add"} Employee</DialogTitle>
                    <DialogDescription>{editingItem ? "Update" : "Enter"} employee details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeName">Full Name</Label>
                      <Input
                        id="employeeName"
                        value={formData.employeeName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, employeeName: e.target.value }))}
                        placeholder="Employee full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                        placeholder="Job position"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, hireDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary ($)</Label>
                        <Input
                          id="salary"
                          type="number"
                          step="0.01"
                          value={formData.salary}
                          onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                          placeholder="Monthly salary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                        <Select
                          value={formData.paymentFrequency}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentFrequency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingItem ? "Update" : "Add"} Employee
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
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.employeeName}</TableCell>
                      <TableCell>{item.position}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{item.phone}</p>
                          <p className="text-xs text-gray-600">{item.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(item.hireDate).toLocaleDateString()}</TableCell>
                      <TableCell>${item.salary.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
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
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Records</CardTitle>
                <CardDescription>Track employee payments and payroll</CardDescription>
              </div>
              <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetPaymentForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>Enter employee payment details</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee</Label>
                      <Select
                        value={paymentData.employeeId}
                        onValueChange={(value) => setPaymentData((prev) => ({ ...prev, employeeId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter((emp) => emp.isActive)
                            .map((employee) => (
                              <SelectItem key={employee.id} value={employee.id.toString()}>
                                {employee.employeeName} - {employee.position}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={paymentData.paymentDate}
                          onChange={(e) => setPaymentData((prev) => ({ ...prev, paymentDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData((prev) => ({ ...prev, amount: e.target.value }))}
                          placeholder="Payment amount"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentPeriodStart">Period Start</Label>
                        <Input
                          id="paymentPeriodStart"
                          type="date"
                          value={paymentData.paymentPeriodStart}
                          onChange={(e) => setPaymentData((prev) => ({ ...prev, paymentPeriodStart: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentPeriodEnd">Period End</Label>
                        <Input
                          id="paymentPeriodEnd"
                          type="date"
                          value={paymentData.paymentPeriodEnd}
                          onChange={(e) => setPaymentData((prev) => ({ ...prev, paymentPeriodEnd: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={paymentData.paymentMethod}
                        onValueChange={(value) => setPaymentData((prev) => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={paymentData.notes}
                        onChange={(e) => setPaymentData((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Payment notes"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Record Payment
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
                    <TableHead>Employee</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.employeeName}</TableCell>
                      <TableCell>{new Date(item.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-bold">${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {item.paymentPeriodStart && item.paymentPeriodEnd ? (
                          <div className="text-sm">
                            <p>{new Date(item.paymentPeriodStart).toLocaleDateString()}</p>
                            <p>to {new Date(item.paymentPeriodEnd).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.paymentMethod.replace("_", " ")}</Badge>
                      </TableCell>
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
