// pulsevest/app/api/pulse-points/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { fanId, projectId, actionType } = await req.json();

    if (!fanId || !projectId || !actionType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("pulsevest");
    const usersCollection = db.collection("users");
    const interactionsCollection = db.collection("interactions");

    // Check if this fan has already performed this action for this project
    const existingInteraction = await interactionsCollection.findOne({
      fanId,
      projectId,
      actionType,
    });
    if (existingInteraction) {
      return NextResponse.json(
        { message: "Points already awarded for this action." },
        { status: 200 }
      );
    }

    // Count how many unique fans have already interacted with this project for this action
    const interactionCount = await interactionsCollection.distinct("fanId", {
      projectId,
      actionType,
    });
    const rank = interactionCount.length; // 0 for the first fan, 1 for the second, etc.

    // Calculate points based on rank
    let pointsToAward = Math.max(0, 5 - rank * 0.1);

    if (pointsToAward > 0) {
      // Update the fan's pulsePoints in the database
      await usersCollection.updateOne(
        { uid: fanId },
        { $inc: { pulsePoints: pointsToAward } }
      );
    }

    // Log this interaction to prevent duplicate points
    await interactionsCollection.insertOne({
      fanId,
      projectId,
      actionType,
      pointsAwarded: pointsToAward,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, pointsAwarded: pointsToAward });
  } catch (error) {
    console.error("Failed to award pulse points:", error);
    return NextResponse.json(
      { error: "Failed to award pulse points" },
      { status: 500 }
    );
  }
}
