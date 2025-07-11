import { NextResponse } from "next/server"

// Mock database - In production, use actual MySQL connection
const inventory = [
  {
    id: 1,
    birdType: "Chicken",
    breed: "Rhode Island Red",
    currentCount: 500,
    ageWeeks: 12,
    purchaseDate: "2024-01-15",
    purchasePrice: 2500.0,
    mortalityCount: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    birdType: "Chicken",
    breed: "Leghorn",
    currentCount: 300,
    ageWeeks: 8,
    purchaseDate: "2024-02-01",
    purchasePrice: 1800.0,
    mortalityCount: 2,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(inventory)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { birdType, breed, currentCount, ageWeeks, purchaseDate, purchasePrice, mortalityCount } = body

    const newItem = {
      id: inventory.length + 1,
      birdType,
      breed,
      currentCount,
      ageWeeks,
      purchaseDate,
      purchasePrice,
      mortalityCount: mortalityCount || 0,
      createdAt: new Date().toISOString(),
    }

    inventory.push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
