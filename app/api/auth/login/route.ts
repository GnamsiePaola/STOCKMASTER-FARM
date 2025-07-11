import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock database - In production, use actual MySQL connection
const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@poultrymanager.com",
    passwordHash: "$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ",
    firstName: "System",
    lastName: "Administrator",
    role: "admin",
    isActive: true,
  },
  {
    id: 2,
    username: "farmer1",
    email: "farmer@example.com",
    passwordHash: "$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ",
    firstName: "John",
    lastName: "Smith",
    role: "farmer",
    isActive: true,
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email && u.isActive)
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // For demo purposes, accept any password
    // In production, use: const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    const isValidPassword = true

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Return success with token
    const { passwordHash, ...userResponse } = user
    return NextResponse.json({
      message: "Login successful",
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
