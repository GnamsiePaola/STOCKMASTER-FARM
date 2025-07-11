import { NextResponse } from "next/server"

// Mock database
const reminders = [
  {
    id: 1,
    title: "Newcastle Disease Vaccination",
    description: "Vaccinate all birds against Newcastle disease",
    reminderDate: "2024-02-15",
    reminderType: "vaccination",
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Feed Stock Check",
    description: "Check and reorder feed supplies",
    reminderDate: "2024-02-10",
    reminderType: "feeding",
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(
      reminders.sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()),
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, reminderDate, reminderType } = body

    const newReminder = {
      id: reminders.length + 1,
      title,
      description: description || "",
      reminderDate,
      reminderType,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    }

    reminders.push(newReminder)
    return NextResponse.json(newReminder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
