import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import type { LiveProject } from "@/types"

// --- GET A CREATOR'S PROJECTS ---
// This function is called by the Creator Dashboard to display their live projects.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const creatorId = searchParams.get("creatorId")

    if (!creatorId) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 })
    }

    let client
    try {
      client = await connectToDatabase()
    } catch (error) {
      return NextResponse.json(
        { error: "Database connection failed. Please ensure MongoDB is properly configured." },
        { status: 500 },
      )
    }

    const db = client.db("pulsevest") // Use your actual database name

    // Find all projects that match the creator's ID and sort them by creation date
    const projects = await db
      .collection("projects")
      .find({ creatorId: creatorId })
      .sort({ createdAt: -1 }) // Show newest first
      .toArray()

    // Convert MongoDB's internal ObjectId to a simple string for frontend compatibility
    const projectsWithStringIds = projects.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json({ projects: projectsWithStringIds })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// --- CREATE (POST) A NEW PROJECT ---
// This function is called by the Creator Dashboard after analysis and upload are complete.
export async function POST(req: NextRequest) {
  try {
    const projectData: Omit<LiveProject, "_id"> = await req.json()

    let client
    try {
      client = await connectToDatabase()
    } catch (error) {
      return NextResponse.json(
        { error: "Database connection failed. Please ensure MongoDB is properly configured." },
        { status: 500 },
      )
    }

    const db = client.db("pulsevest") // Use your actual database name

    // Insert the new project data into the 'projects' collection
    const result = await db.collection("projects").insertOne(projectData)

    if (!result.insertedId) {
      throw new Error("Database insertion failed.")
    }

    // Return the new project's unique MongoDB ID
    return NextResponse.json({
      success: true,
      projectId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Failed to publish project:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
