// pulsevest/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, fanId, fanName, rating, comment } = body;

    if (!projectId || !fanId || !fanName || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("pulsevest");
    const reviewsCollection = db.collection("reviews");

    // Prevent duplicate reviews by the same fan for the same project
    const existingReview = await reviewsCollection.findOne({
      projectId,
      fanId,
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this project." },
        { status: 409 }
      );
    }

    const newReview: Omit<Review, "_id" | "id"> = {
      projectId,
      fanId,
      fanName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    const result = await reviewsCollection.insertOne(newReview);

    return NextResponse.json(
      { success: true, reviewId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to post review:", error);
    return NextResponse.json(
      { error: "Failed to post review" },
      { status: 500 }
    );
  }
}
