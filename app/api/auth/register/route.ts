import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Mock database - In production, use actual MySQL connection
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, firstName, lastName, phone, role } = body

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email || u.username === username)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || null,
      role: role || "farmer",
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    users.push(newUser)

    // Return success (don't include password hash)
    const { passwordHash: _, ...userResponse } = newUser
    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
