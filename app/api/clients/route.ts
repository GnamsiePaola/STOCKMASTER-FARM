import { NextResponse } from "next/server"

// Mock database
const clients = [
  {
    id: 1,
    clientName: "Local Grocery Store",
    contactPerson: "Manager",
    phone: "+1234567894",
    email: "manager@grocery.com",
    address: "123 Main St, City, State",
    clientType: "business",
    creditLimit: 5000.0,
    outstandingBalance: 1200.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    clientName: "Restaurant Chain",
    contactPerson: "Purchasing Manager",
    phone: "+1234567895",
    email: "purchasing@restaurant.com",
    address: "456 Business Ave, City, State",
    clientType: "business",
    creditLimit: 10000.0,
    outstandingBalance: 0.0,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientName, contactPerson, phone, email, address, clientType, creditLimit, outstandingBalance } = body

    const newClient = {
      id: clients.length + 1,
      clientName,
      contactPerson: contactPerson || "",
      phone: phone || "",
      email: email || "",
      address: address || "",
      clientType,
      creditLimit,
      outstandingBalance,
      createdAt: new Date().toISOString(),
    }

    clients.push(newClient)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
