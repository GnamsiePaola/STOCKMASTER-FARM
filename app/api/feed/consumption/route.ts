import { NextResponse } from "next/server"

// Mock database
const feedConsumption = [
  {
    id: 1,
    feedId: 1,
    consumptionDate: "2024-01-15",
    quantityUsed: 50.0,
    notes: "Daily feeding",
    feedType: "Layer Feed",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(feedConsumption)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { feedId, consumptionDate, quantityUsed, notes } = body

    // In production, you would fetch the feed type from the database
    const feedType = "Layer Feed" // Mock data

    const newItem = {
      id: feedConsumption.length + 1,
      feedId,
      consumptionDate,
      quantityUsed,
      notes: notes || "",
      feedType,
      createdAt: new Date().toISOString(),
    }

    feedConsumption.push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
