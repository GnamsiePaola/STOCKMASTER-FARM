import { NextResponse } from "next/server"

// Mock database
const employees = [
  {
    id: 1,
    employeeName: "Mike Johnson",
    position: "Farm Worker",
    phone: "+1234567892",
    email: "mike@farm.com",
    hireDate: "2024-01-01",
    salary: 2000.0,
    paymentFrequency: "monthly",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    employeeName: "Sarah Wilson",
    position: "Veterinary Assistant",
    phone: "+1234567893",
    email: "sarah@farm.com",
    hireDate: "2024-01-15",
    salary: 2500.0,
    paymentFrequency: "monthly",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeName, position, phone, email, hireDate, salary, paymentFrequency } = body

    const newEmployee = {
      id: employees.length + 1,
      employeeName,
      position,
      phone: phone || "",
      email: email || "",
      hireDate,
      salary,
      paymentFrequency,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    employees.push(newEmployee)
    return NextResponse.json(newEmployee, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
