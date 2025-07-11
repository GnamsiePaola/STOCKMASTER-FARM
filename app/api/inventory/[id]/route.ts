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
]

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { birdType, breed, currentCount, ageWeeks, purchaseDate, purchasePrice, mortalityCount } = body

    const itemIndex = inventory.findIndex((item) => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    inventory[itemIndex] = {
      ...inventory[itemIndex],
      birdType,
      breed,
      currentCount,
      ageWeeks,
      purchaseDate,
      purchasePrice,
      mortalityCount: mortalityCount || 0,
    }

    return NextResponse.json(inventory[itemIndex])
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const itemIndex = inventory.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    inventory.splice(itemIndex, 1)
    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
