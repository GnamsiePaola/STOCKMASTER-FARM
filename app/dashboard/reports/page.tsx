"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Egg,
  Bird,
  Heart,
  Users,
  Calendar,
  BarChart3,
  PieChart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ReportData {
  production: {
    totalEggs: number
    averageDaily: number
    monthlyTrend: number
  }
  inventory: {
    totalBirds: number
    mortalityRate: number
    feedStock: number
  }
  financial: {
    totalRevenue: number
    totalExpenses: number
    profit: number
    profitMargin: number
  }
  health: {
    totalTreatments: number
    upcomingDue: number
    healthCost: number
  }
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod])

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/reports?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      setError("Failed to load report data")
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (reportType: string) => {
    try {
      const response = await fetch(`/api/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType, period: selectedPeriod }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      setError("Failed to generate report")
    }
  }

  const reportTypes = [
    {
      id: "production",
      title: "Production Report",
      description: "Egg production analysis and trends",
      icon: Egg,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/dashboard/reports/production",
    },
    {
      id: "financial",
      title: "Financial Report",
      description: "Revenue, expenses, and profit analysis",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/dashboard/reports/financial",
    },
    {
      id: "inventory",
      title: "Inventory Report",
      description: "Poultry and feed inventory status",
      icon: Bird,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/dashboard/reports/inventory",
    },
    {
      id: "health",
      title: "Health Report",
      description: "Vaccination and treatment records",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      link: "/dashboard/reports/health",
    },
    {
      id: "sales",
      title: "Sales Report",
      description: "Customer sales and revenue breakdown",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/dashboard/reports/sales",
    },
    {
      id: "employee",
      title: "Employee Report",
      description: "Staff performance and payroll",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      link: "/dashboard/reports/employee",
    },
  ]

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive farm reports and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Reports"
            width={120}
            height={80}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${reportData.financial.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.financial.profitMargin.toFixed(1)}% profit margin
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Egg Production</CardTitle>
              <Egg className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {reportData.production.totalEggs.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{reportData.production.averageDaily} avg daily</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bird Count</CardTitle>
              <Bird className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{reportData.inventory.totalBirds}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.inventory.mortalityRate.toFixed(1)}% mortality rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Cost</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${reportData.health.healthCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{reportData.health.totalTreatments} treatments</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport(report.id)}
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </Button>
              </div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Link href={report.link}>
                  <Button variant="default" size="sm" className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>
                </Link>
                <Badge variant="secondary">{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
          <CardDescription>Generate common reports with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => generateReport("summary")}
            >
              <FileText className="w-6 h-6" />
              <span>Farm Summary</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => generateReport("performance")}
            >
              <TrendingUp className="w-6 h-6" />
              <span>Performance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => generateReport("compliance")}
            >
              <Calendar className="w-6 h-6" />
              <span>Compliance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => generateReport("custom")}
            >
              <PieChart className="w-6 h-6" />
              <span>Custom Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Monthly Production Report", date: "2024-01-15", type: "Production", size: "2.3 MB" },
              { name: "Financial Summary Q1", date: "2024-01-10", type: "Financial", size: "1.8 MB" },
              { name: "Inventory Status Report", date: "2024-01-08", type: "Inventory", size: "1.2 MB" },
              { name: "Health Records Summary", date: "2024-01-05", type: "Health", size: "0.9 MB" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-600">
                      {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{report.type}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
