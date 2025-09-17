// pulsevest/app/api/users/route.ts
import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

// --- CREATE A NEW USER PROFILE IN MONGODB ---
export async function POST(req: NextRequest) {
  try {
    const { uid, name, email, role } = await req.json();

    if (!uid || !name || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("pulsevest");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ uid });
    if (existingUser) {
      return NextResponse.json(
        { message: "User profile already exists" },
        { status: 200 }
      );
    }

    // Create a new user document
    const newUser = {
      uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create user profile:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
