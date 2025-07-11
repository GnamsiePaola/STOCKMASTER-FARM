"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Bird,
  Wheat,
  Heart,
  DollarSign,
  Users,
  FileText,
  Settings,
  LogOut,
  Egg,
  UserCheck,
  Calendar,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Poultry Inventory", href: "/dashboard/inventory", icon: Bird },
  { name: "Feed Management", href: "/dashboard/feed", icon: Wheat },
  { name: "Egg Production", href: "/dashboard/production", icon: Egg },
  { name: "Health Records", href: "/dashboard/health", icon: Heart },
  { name: "Sales & Revenue", href: "/dashboard/sales", icon: DollarSign },
  { name: "Expenses", href: "/dashboard/expenses", icon: TrendingUp },
  { name: "Employees", href: "/dashboard/employees", icon: UserCheck },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Reminders", href: "/dashboard/reminders", icon: Calendar },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Bird className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Poultry Manager</h2>
          <p className="text-xs text-gray-500">Farm Management System</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-medium">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <h1 className="text-lg font-semibold">Poultry Manager</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
