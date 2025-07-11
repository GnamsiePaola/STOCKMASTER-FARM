import { NextResponse } from "next/server"

// Mock database
const payments = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Mike Johnson",
    paymentDate: "2024-01-31",
    amount: 2000.0,
    paymentPeriodStart: "2024-01-01",
    paymentPeriodEnd: "2024-01-31",
    paymentMethod: "bank_transfer",
    notes: "January salary",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(
      payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()),
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { employeeId, paymentDate, amount, paymentPeriodStart, paymentPeriodEnd, paymentMethod, notes } = body

    // In production, you would fetch the employee name from the database
    const employeeName = "Employee Name" // Mock data

    const newPayment = {
      id: payments.length + 1,
      employeeId,
      employeeName,
      paymentDate,
      amount,
      paymentPeriodStart: paymentPeriodStart || "",
      paymentPeriodEnd: paymentPeriodEnd || "",
      paymentMethod,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    }

    payments.push(newPayment)
    return NextResponse.json(newPayment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
