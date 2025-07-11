"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Bell, Shield, Mail, Smartphone, Save, RefreshCw } from "lucide-react"
import Image from "next/image"

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    farmName: string
    location: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    reminderAlerts: boolean
    healthAlerts: boolean
    productionAlerts: boolean
    lowStockAlerts: boolean
  }
  preferences: {
    currency: string
    dateFormat: string
    timeZone: string
    language: string
    theme: string
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    passwordChangeRequired: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      farmName: "",
      location: "",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      reminderAlerts: true,
      healthAlerts: true,
      productionAlerts: true,
      lowStockAlerts: true,
    },
    preferences: {
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      timeZone: "America/New_York",
      language: "en",
      theme: "light",
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
    },
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "preferences" | "security">("profile")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSuccess("Settings saved successfully!")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to save settings")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setSaving(false)
    }
  }

  const updateProfile = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }))
  }

  const updateNotifications = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }))
  }

  const updatePreferences = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }))
  }

  const updateSecurity = (field: string, value: boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, [field]: value },
    }))
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-slate-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleSave} disabled={saving} className="flex items-center space-x-2">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </Button>
          <Image
            src="/placeholder.svg?height=80&width=120"
            alt="Settings"
            width={120}
            height={80}
            className="rounded-lg shadow-md"
          />
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="bg-white/80 backdrop-blur-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Update your personal and farm information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.profile.firstName}
                      onChange={(e) => updateProfile("firstName", e.target.value)}
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.profile.lastName}
                      onChange={(e) => updateProfile("lastName", e.target.value)}
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Farm Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                      id="farmName"
                      value={settings.profile.farmName}
                      onChange={(e) => updateProfile("farmName", e.target.value)}
                      placeholder="Your farm name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Location</Label>
                    <Textarea
                      id="location"
                      value={settings.profile.location}
                      onChange={(e) => updateProfile("location", e.target.value)}
                      placeholder="Farm address and location details"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Communication Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => updateNotifications("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via text message</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onCheckedChange={(checked) => updateNotifications("smsNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reminder Alerts</p>
                        <p className="text-sm text-gray-600">Notifications for upcoming tasks and reminders</p>
                      </div>
                      <Switch
                        checked={settings.notifications.reminderAlerts}
                        onCheckedChange={(checked) => updateNotifications("reminderAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Health Alerts</p>
                        <p className="text-sm text-gray-600">Notifications for health-related events</p>
                      </div>
                      <Switch
                        checked={settings.notifications.healthAlerts}
                        onCheckedChange={(checked) => updateNotifications("healthAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Production Alerts</p>
                        <p className="text-sm text-gray-600">Notifications for production milestones</p>
                      </div>
                      <Switch
                        checked={settings.notifications.productionAlerts}
                        onCheckedChange={(checked) => updateNotifications("productionAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Low Stock Alerts</p>
                        <p className="text-sm text-gray-600">Notifications when inventory is running low</p>
                      </div>
                      <Switch
                        checked={settings.notifications.lowStockAlerts}
                        onCheckedChange={(checked) => updateNotifications("lowStockAlerts", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Application Preferences</span>
                </CardTitle>
                <CardDescription>Customize your application experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.preferences.currency}
                      onValueChange={(value) => updatePreferences("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={settings.preferences.dateFormat}
                      onValueChange={(value) => updatePreferences("dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Select
                      value={settings.preferences.timeZone}
                      onValueChange={(value) => updatePreferences("timeZone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => updatePreferences("language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value) => updatePreferences("theme", value)}
                  >
                    <SelectTrigger className="w-full md:w-1/2">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Manage your account security and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSecurity("twoFactorEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Password Change</p>
                      <p className="text-sm text-gray-600">Force password change on next login</p>
                    </div>
                    <Switch
                      checked={settings.security.passwordChangeRequired}
                      onCheckedChange={(checked) => updateSecurity("passwordChangeRequired", checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onValueChange={(value) => updateSecurity("sessionTimeout", Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-full md:w-1/2">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Management</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full md:w-auto bg-transparent">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto bg-transparent">
                      Download Account Data
                    </Button>
                    <Button variant="destructive" className="w-full md:w-auto">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
