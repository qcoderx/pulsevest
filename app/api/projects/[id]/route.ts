import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import type { LiveProject } from "@/types"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
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

    const db = client.db("pulsevest")

    // Find the specific project by ID
    const project = await db.collection("projects").findOne({ id: projectId })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Convert MongoDB's internal ObjectId to a simple string for frontend compatibility
    const projectWithStringId = {
      ...project,
      _id: project._id.toString(),
    }

    return NextResponse.json({ project: projectWithStringId })
  } catch (error) {
    console.error("Failed to fetch project:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const updatedData: Partial<LiveProject> = await req.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
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

    const db = client.db("pulsevest")

    // Update the project
    const result = await db.collection("projects").updateOne({ id: projectId }, { $set: updatedData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
    })
  } catch (error) {
    console.error("Failed to update project:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
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

    const db = client.db("pulsevest")

    // Delete the project
    const result = await db.collection("projects").deleteOne({ id: projectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete project:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
