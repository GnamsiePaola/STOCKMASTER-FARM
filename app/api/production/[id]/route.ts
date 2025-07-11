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
]

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { productionDate, eggsCollected, brokenEggs, notes } = body

    const itemIndex = productions.findIndex((item) => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({ message: "Production record not found" }, { status: 404 })
    }

    productions[itemIndex] = {
      ...productions[itemIndex],
      productionDate,
      eggsCollected,
      brokenEggs: brokenEggs || 0,
      notes: notes || "",
    }

    return NextResponse.json(productions[itemIndex])
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const itemIndex = productions.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Production record not found" }, { status: 404 })
    }

    productions.splice(itemIndex, 1)
    return NextResponse.json({ message: "Production record deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
