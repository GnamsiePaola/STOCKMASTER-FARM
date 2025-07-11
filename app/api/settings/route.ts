import { NextResponse } from "next/server"

// Mock settings data
let userSettings = {
  profile: {
    firstName: "John",
    lastName: "Smith",
    email: "farmer@example.com",
    phone: "+1234567891",
    farmName: "Green Valley Poultry Farm",
    location: "123 Farm Road, Rural County",
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
}

export async function GET() {
  try {
    return NextResponse.json(userSettings)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    userSettings = { ...userSettings, ...body }
    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
