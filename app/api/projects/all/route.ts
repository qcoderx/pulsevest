import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"

// --- GET ALL LIVE PROJECTS FOR FANS/INVESTORS ---
export async function GET() {
  try {
    let client
    try {
      client = await connectToDatabase()
    } catch (error) {
      return NextResponse.json(
        { error: "Database connection failed. Please ensure MongoDB is properly configured." },
        { status: 500 },
      )
    }

    const db = client.db("pulsevest")

    const projects = await db
      .collection("projects")
      .find({}) // An empty filter gets all documents
      .sort({ createdAt: -1 }) // Show newest first
      .toArray()

    // Convert MongoDB's internal ObjectId to a simple string for frontend compatibility
    const projectsWithStringIds = projects.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json({ projects: projectsWithStringIds })
  } catch (error) {
    console.error("Failed to fetch all projects:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
