// pulsevest/app/api/reviews/[projectId]/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export const revalidate = 0; // Ensures fresh data on every request

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("pulsevest");

    const reviews = await db
      .collection("reviews")
      .find({ projectId: projectId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
