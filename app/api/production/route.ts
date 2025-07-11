import { NextResponse } from "next/server"

// Mock database
const productions = [
  {
    id: 1,
    productionDate: "2024-01-15",
    eggsCollected: 450,
    brokenEggs: 5,
    notes: "Good production day",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    productionDate: "2024-01-14",
    eggsCollected: 420,
    brokenEggs: 3,
    notes: "Normal production",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(
      productions.sort((a, b) => new Date(b.productionDate).getTime() - new Date(a.productionDate).getTime()),
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productionDate, eggsCollected, brokenEggs, notes } = body

    const newItem = {
      id: productions.length + 1,
      productionDate,
      eggsCollected,
      brokenEggs: brokenEggs || 0,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    }

    productions.push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
