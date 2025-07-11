// Mock database
const healthRecords = [
  {
    id: 1,
    treatmentType: "vaccination",
    treatmentName: "Newcastle Disease Vaccine",
    treatmentDate: "2024-01-10",
    nextDueDate: "2024-04-10",
    notes: "All birds vaccinated successfully",
    cost: 150.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    treatmentType: "medication",
    treatmentName: "Antibiotic Treatment",
    treatmentDate: "2024-01-05",
    nextDueDate: null,
    notes: "Treatment for respiratory infection",
    cost: 75.0,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Return mock health records as JSON
    return new Response(JSON.stringify(healthRecords), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch health records' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
