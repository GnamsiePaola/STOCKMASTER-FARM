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
import { Plus, Edit, Trash2, Users, Building, CreditCard, TrendingUp } from "lucide-react"
import Image from "next/image"

interface Client {
  id: number
  clientName: string
  contactPerson: string
  phone: string
  email: string
  address: string
  clientType: string
  creditLimit: number
  outstandingBalance: number
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    clientName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    clientType: "individual",
    creditLimit: "",
    outstandingBalance: "0",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const url = editingItem ? `/api/clients/${editingItem.id}` : "/api/clients"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          clientType: formData.clientType,
          creditLimit: Number.parseFloat(formData.creditLimit) || 0,
          outstandingBalance: Number.parseFloat(formData.outstandingBalance) || 0,
        }),
      })

      if (response.ok) {
        setSuccess(editingItem ? "Client updated successfully!" : "Client added successfully!")
        setDialogOpen(false)
        resetForm()
        fetchClients()
      } else {
        const data = await response.json()
        setError(data.message || "Operation failed")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Client deleted successfully!")
        fetchClients()
      }
    } catch (error) {
      setError("Failed to delete client")
    }
  }

  const resetForm = () => {
    setFormData({
      clientName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      clientType: "individual",
      creditLimit: "",
      outstandingBalance: "0",
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: Client) => {
    setEditingItem(item)
    setFormData({
      clientName: item.clientName,
      contactPerson: item.contactPerson,
      phone: item.phone,
      email: item.email,
      address: item.address,
      clientType: item.clientType,
      creditLimit: item.creditLimit.toString(),
      outstandingBalance: item.outstandingBalance.toString(),
    })
    setDialogOpen(true)
  }

  // Calculate statistics
  const totalClients = clients.length
  const businessClients = clients.filter((client) => client.clientType === "business").length
  const totalCreditLimit = clients.reduce((sum, client) => sum + client.creditLimit, 0)
  const totalOutstanding = clients.reduce((sum, client) => sum + client.outstandingBalance, 0)

  const getClientTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      individual: "bg-blue-100 text-blue-800",
      business: "bg-green-100 text-green-800",
      retailer: "bg-purple-100 text-purple-800",
      wholesaler: "bg-orange-100 text-orange-800",
    }
    return colors[type] || colors.individual
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage customers and business relationships</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Client Management"
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
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Clients</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{businessClients}</div>
            <p className="text-xs text-muted-foreground">Corporate customers</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalCreditLimit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total credit extended</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pending payments</p>
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
              <CardTitle>Client Management</CardTitle>
              <CardDescription>Manage your customers and their information</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Client</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Enter"} client information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Client or company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Primary contact person"
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
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Full address"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientType">Client Type</Label>
                    <Select
                      value={formData.clientType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, clientType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit ($)</Label>
                      <Input
                        id="creditLimit"
                        type="number"
                        step="0.01"
                        value={formData.creditLimit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, creditLimit: e.target.value }))}
                        placeholder="Credit limit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outstandingBalance">Outstanding ($)</Label>
                      <Input
                        id="outstandingBalance"
                        type="number"
                        step="0.01"
                        value={formData.outstandingBalance}
                        onChange={(e) => setFormData((prev) => ({ ...prev, outstandingBalance: e.target.value }))}
                        placeholder="Outstanding balance"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update" : "Add"} Client
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
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.clientName}</p>
                        <p className="text-sm text-gray-600">{item.contactPerson}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{item.phone}</p>
                        <p className="text-xs text-gray-600">{item.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getClientTypeColor(item.clientType)}>{item.clientType}</Badge>
                    </TableCell>
                    <TableCell>${item.creditLimit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={item.outstandingBalance > 0 ? "destructive" : "secondary"}>
                        ${item.outstandingBalance.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.outstandingBalance > item.creditLimit * 0.8
                            ? "destructive"
                            : item.outstandingBalance > 0
                              ? "outline"
                              : "default"
                        }
                      >
                        {item.outstandingBalance > item.creditLimit * 0.8
                          ? "High Risk"
                          : item.outstandingBalance > 0
                            ? "Pending"
                            : "Good"}
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

      {/* Client Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Client Types Distribution</CardTitle>
            <CardDescription>Breakdown by client categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["individual", "business", "retailer", "wholesaler"].map((type) => {
                const typeClients = clients.filter((client) => client.clientType === type)
                const percentage = totalClients > 0 ? (typeClients.length / totalClients) * 100 : 0

                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{type}</p>
                      <p className="text-sm text-gray-600">{typeClients.length} clients</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{percentage.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">
                        ${typeClients.reduce((sum, client) => sum + client.outstandingBalance, 0).toFixed(2)}{" "}
                        outstanding
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>High Priority Clients</CardTitle>
            <CardDescription>Clients with high outstanding balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients
                .filter((client) => client.outstandingBalance > 0)
                .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
                .slice(0, 5)
                .map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{client.clientName}</p>
                      <p className="text-sm text-gray-600">{client.clientType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">${client.outstandingBalance.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Outstanding</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
