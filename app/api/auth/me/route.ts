import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock user data
const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@poultrymanager.com",
    firstName: "System",
    lastName: "Administrator",
    role: "admin",
    isActive: true,
  },
  {
    id: 2,
    username: "farmer1",
    email: "farmer@example.com",
    firstName: "John",
    lastName: "Smith",
    role: "farmer",
    isActive: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Find user
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
