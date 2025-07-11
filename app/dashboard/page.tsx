"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Egg, DollarSign, TrendingUp, TrendingDown, Bird, Wheat, Heart, Calendar, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface DashboardStats {
  totalBirds: number
  totalEggs: number
  monthlyRevenue: number
  monthlyExpenses: number
  profitLoss: number
  feedStock: number
  upcomingReminders: number
  healthAlerts: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBirds: 0,
    totalEggs: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    profitLoss: 0,
    feedStock: 0,
    upcomingReminders: 0,
    healthAlerts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your farm overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Poultry Farm"
            width={100}
            height={100}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Birds</CardTitle>
            <Bird className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBirds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active poultry count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eggs Collected</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEggs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">From sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            {stats.profitLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(stats.profitLoss)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Stock</CardTitle>
            <Wheat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feedStock} kg</div>
            <p className="text-xs text-muted-foreground">Available feed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthAlerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingReminders}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Egg className="h-5 w-5" />
              Record Egg Production
            </CardTitle>
            <CardDescription>Log today's egg collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Add Production Record</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wheat className="h-5 w-5" />
              Feed Management
            </CardTitle>
            <CardDescription>Track feed consumption and stock</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              Manage Feed
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Records
            </CardTitle>
            <CardDescription>Update vaccination and health data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-transparent" variant="outline">
              Health Management
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest farm activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <Egg className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Egg collection recorded</p>
                <p className="text-sm text-gray-600">450 eggs collected today</p>
              </div>
              <Badge variant="secondary">Today</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <Wheat className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">Feed consumption logged</p>
                <p className="text-sm text-gray-600">120kg of layer feed used</p>
              </div>
              <Badge variant="secondary">Yesterday</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium">Vaccination reminder</p>
                <p className="text-sm text-gray-600">Newcastle disease vaccination due in 3 days</p>
              </div>
              <Badge variant="outline">Upcoming</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
