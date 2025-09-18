// pulsevest/app/api/projects/all/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

// --- THIS IS THE CRITICAL ADDITION ---
// This tells Vercel not to cache the results of this route.
export const revalidate = 0;

export async function GET() {
  try {
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      return NextResponse.json(
        {
          error:
            "Database connection failed. Please ensure MongoDB is properly configured.",
        },
        { status: 500 }
      );
    }

    const db = client.db("pulsevest");

    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const projectsWithStringIds = projects.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({ projects: projectsWithStringIds });
  } catch (error) {
    console.error("Failed to fetch all projects:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
