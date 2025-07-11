import { NextResponse } from "next/server"

// Mock database
const feedInventory = [
  {
    id: 1,
    feedType: "Layer Feed",
    quantityKg: 1000.0,
    unitPrice: 0.5,
    supplier: "Farm Supply Co",
    purchaseDate: "2024-01-01",
    expiryDate: "2024-06-01",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    feedType: "Starter Feed",
    quantityKg: 500.0,
    unitPrice: 0.6,
    supplier: "Farm Supply Co",
    purchaseDate: "2024-01-01",
    expiryDate: "2024-06-01",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(feedInventory)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { feedType, quantityKg, unitPrice, supplier, purchaseDate, expiryDate } = body

    const newItem = {
      id: feedInventory.length + 1,
      feedType,
      quantityKg,
      unitPrice,
      supplier,
      purchaseDate,
      expiryDate,
      createdAt: new Date().toISOString(),
    }

    feedInventory.push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
